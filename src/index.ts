import { Disciplina, Grade, Periodo } from "./types/types";
import axios from "axios";
import scrapedData from "./json/scrapedData.json";
import {
  ImportDisciplina,
  ImportGrade,
  ImportPeriodo,
} from "./types/importTypes";
import { ReturnDisciplina } from "./types/returnTypes";

/* --------------------------------- Config --------------------------------- */

const api = axios.create({ baseURL: "http://localhost:4500" });
const data: ImportGrade[] = scrapedData;

/* ---------------------------------- Main ---------------------------------- */

const simpleDisciplines: Disciplina[] = [];
const prerequisiteDisciplines: Disciplina[] = [];

data[0].periodos.forEach((periodo) => {
  periodo.disciplinas.forEach((disciplina) => {
    if (disciplina.preRequisitos) {
      return prerequisiteDisciplines.push(disciplina);
    }

    return simpleDisciplines.push(disciplina);
  });
});

/* -------------------------------- Functions ------------------------------- */

/* --------------------------- Auxiliary functions -------------------------- */

function findDisciplina(codDisciplina: string) {
  return api.post<ReturnDisciplina>("/findDisciplina", {
    codDisciplina: codDisciplina,
  });
}

function updateDisciplina(disciplina: Disciplina, id: string) {
  return api.put<ReturnDisciplina>(`/disciplinas/${id}`, disciplina);
}

function insertDisciplina(disciplina: Disciplina) {
  return api.post<ReturnDisciplina>("/disciplinas", disciplina);
}

function insertGrade(grade: Grade) {
  return api.post("/grades", grade);
}

function insertPeriodo(periodo: Periodo) {
  return api.post("/periodos", periodo);
}
