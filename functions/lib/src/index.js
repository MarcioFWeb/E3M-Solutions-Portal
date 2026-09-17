"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const params_1 = require("firebase-functions/params");
const resend_1 = require("resend");
const cors_1 = __importDefault(require("cors"));
// Definindo o secret. O valor será injetado no runtime.
const resendApiKey = (0, params_1.defineString)("RESEND_API_KEY");
const corsHandler = (0, cors_1.default)({ origin: true }); // Permitir origens cruzadas (ajuste para produção depois)
exports.sendContactEmail = (0, https_1.onRequest)({ secrets: [resendApiKey] }, (request, response) => {
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
            const resend = new resend_1.Resend(resendApiKey.value());
            const data = await resend.emails.send({
                from: "Contato Portal E3M <onboarding@resend.dev>", // TODO: Altere para um email do seu domínio verificado no Resend
                to: "contato@e3m.dev.br", // Onde você quer receber os leads
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
            logger.info("Email enviado com sucesso", { id: data.id });
            response.status(200).json({ success: true, id: data.id });
        }
        catch (error) {
            logger.error("Erro ao enviar email", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    });
});
//# sourceMappingURL=index.js.map