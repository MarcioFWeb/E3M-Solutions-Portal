import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";
import cors from "cors";

// Definindo o secret. O valor será injetado no runtime.
const resendApiKey = defineSecret("RESEND_API_KEY");

const corsHandler = cors({ origin: true }); // Permitir origens cruzadas (ajuste para produção depois)

export const sendContactEmail = onRequest(
  { secrets: [resendApiKey] },
  (request, response) => {
    corsHandler(request, response, async () => {
      // Aceita apenas requisições POST
      if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
      }

      try {
        const { name, email, phone, company, service, message, requestDiagnostic } = request.body;

        // Validação básica
        if (!name || !email || !message) {
          response.status(400).json({ error: "Missing required fields" });
          return;
        }

        const resend = new Resend(resendApiKey.value());

        const { data, error } = await resend.emails.send({
          from: "Contato Portal E3M <contato@msg.marcio.dev.br>",
          to: "contato@marcio.dev.br",
          subject: `Novo Contato Site: ${name} - ${company || "Não informado"}`,
          html: `
            <h2>Novo Contato via Site E3M</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>
            <p><strong>Empresa:</strong> ${company || "Não informado"}</p>
            <p><strong>Serviço de interesse:</strong> ${service || "Não informado"}</p>
            <p><strong>Solicitou Diagnóstico IA?</strong> ${requestDiagnostic ? "Sim" : "Não"}</p>
            <hr />
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\\n/g, "<br>")}</p>
          `,
        });

        if (error) {
          logger.error("Erro do Resend", error);
          response.status(500).json({ error: "Erro ao enviar e-mail" });
          return;
        }

        logger.info("Email enviado com sucesso", { id: data?.id });
        response.status(200).json({ success: true, id: data?.id });
      } catch (error) {
        logger.error("Erro ao enviar email", error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
);
