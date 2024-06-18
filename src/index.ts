import { Disciplina, Grade, Periodo } from './types';
import axios from 'axios';
import data from './scrapedData.json';
import { ImportDisciplina, ImportGrade, ImportPeriodo } from './importTypes';
import { ReturnDisciplina } from './returnTypes';

/* --------------------------------- Config --------------------------------- */

const api = axios.create({ baseURL: 'http://localhost:4500' });

let periodosIds: string[] = [];
let disciplinasIds: string[] = [];

/* ---------------------------------- Main ---------------------------------- */

data.forEach(async (grade: ImportGrade) => {
    const periodoResults = await Promise.all(grade.periodos.map(importPeriodo));

    console.log(periodoResults);

    const gradeToBeCreated: Grade = {
        ano: grade.ano,
        curso: grade.curso,
        idGrade: grade.idGrade,
        periodos: periodoResults,
    };

    insertGrade(gradeToBeCreated)
        .then(({ data }) => {
            console.log(data);
        })
        .catch((err) => {
            console.error(err.response.data.message);
        });
});

/* -------------------------------- Functions ------------------------------- */

async function importPeriodo(periodo: ImportPeriodo) {
    const disciplinaResults = await Promise.all(periodo.disciplinas.map(importDisciplina));

    const periodoToBeCreated: Periodo = {
        disciplinas: disciplinaResults,
        idPeriodo: periodo.idPeriodo,
        periodo: periodo.idPeriodo,
    };

    // console.log(disciplinasIds);

    return insertPeriodo(periodoToBeCreated)
        .then(({ data }) => {
            return data._id;
        })
        .catch((err) => {
            console.error(err.response.data.message);
        });
}

async function importDisciplina(disciplina: ImportDisciplina) {
    let toBeCreated: Disciplina = {
        nome: disciplina.nome,
        codDisciplina: disciplina.codDisciplina,
        cargaHoraria: disciplina.cargaHoraria,
        ementa: disciplina.ementa,
    };

    let preRequisitosIds: string[] = [];

    if (disciplina.preRequisitos) {
        const requisitos: string[] = disciplina.preRequisitos.split('\n');

        // Map each requisito to a promise
        const requisitoPromises = requisitos.map((requisito) => findDisciplina(requisito));

        // Wait for all promises to resolve
        const requisitoResults = await Promise.all(requisitoPromises);

        // Extract the ids from the results
        preRequisitosIds = requisitoResults.map(({ data }) => data.data._id);

        toBeCreated.preRequisitos = preRequisitosIds;
    }

    return insertDisciplina(toBeCreated)
        .then(({ data }) => {
            return data.data._id;
        })
        .catch((err) => {
            console.error(err.response.data.message);
        });
}

/* --------------------------- Auxiliary functions -------------------------- */

function getAllDisciplinas() {
    return api.get('/disciplinas');
}

function getAllGrades() {
    return api.get('/grades');
}

function getAllPeriodos() {
    return api.get('/periodos');
}

function insertDisciplina(disciplina: Disciplina) {
    return api.post('/disciplinas', disciplina);
}

function findDisciplina(codDisciplina: string) {
    return api.post<ReturnDisciplina>('/findDisciplina', { codDisciplina: codDisciplina });
}

function insertGrade(grade: Grade) {
    return api.post('/grades', grade);
}

function insertPeriodo(periodo: Periodo) {
    return api.post('/periodos', periodo);
}
