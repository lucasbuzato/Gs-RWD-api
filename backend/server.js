import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

// Caminho do seu JSON personalizado
const carreirasPath = path.resolve("/data/arrayCardsGs.json");

// ROTA GET /api/carreiras
app.get("/api/carreiras", (req, res) => {
    fs.readFile(carreirasPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                erro: "Erro ao carregar lista de carreiras"
            });
        }

        try {
            const lista = JSON.parse(data);
            res.json(lista);
        } catch (error) {
            res.status(500).json({
                erro: "Erro ao interpretar o JSON das carreiras"
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
    console.log("Servidor rodando em http://localhost:" + PORT);
});
