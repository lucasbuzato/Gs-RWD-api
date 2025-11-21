import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from 'url'; // Importação necessária para ES Modules

// Configuração para obter __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const PORT = 3000;

// CORREÇÃO: Caminho do seu JSON personalizado
// Agora aponta corretamente para a pasta 'data' dentro do diretório 'backend'
const carreirasPath = path.resolve(__dirname, "data", "arrayCardsGs.json");

// ROTA GET /api/carreiras
app.get("/api/carreiras", (req, res) => {
    fs.readFile(carreirasPath, "utf8", (err, data) => {
        if (err) {
            // Se o arquivo não for encontrado ou houver erro de leitura
            console.error("Erro ao ler o arquivo JSON:", err);
            return res.status(500).json({
                erro: "Erro interno do servidor: Arquivo de dados não encontrado ou inacessível."
            });
        }

        try {
            const lista = JSON.parse(data);
            res.json(lista);
        } catch (error) {
            // Se o JSON estiver mal formatado
            console.error("Erro ao interpretar o JSON:", error);
            res.status(500).json({
                erro: "Erro interno do servidor: O arquivo de dados JSON está mal formatado."
            });
        }
    });
});

// 404 caso a rota não exista
app.use((req, res) => {
    res.status(404).json({
        erro: "Recurso não encontrado"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:" + PORT );
});