import { Disciplina, Grade, Periodo } from './types';
import axios from 'axios';
import data from './scrapedData.json';
import { ImportDisciplina, ImportGrade, ImportPeriodo } from './importTypes';

/* --------------------------------- Config --------------------------------- */

const api = axios.create({ baseURL: 'http://localhost:4500' });

let periodosIds: string[] = [];
let disciplinasIds: string[] = [];

/* ---------------------------------- Main ---------------------------------- */

// console.log(data[0].periodos[0].disciplinas[0]);

// let disciplina = {
//     nome: 'Cálculo I',
//     codDisciplina: 'MAT001',
//     cargaHoraria: 96,
//     ementa: 'Funções. Limite e continuidade. Derivada. Integral. Integral imprópria.',
// };

// insertDisciplina(disciplina)
//     .then(({ data }) => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.error(err.message);
//     });

// importDisciplina(data[0].periodos[0].disciplinas[0]);

// getAllDisciplinas().then(({ data }) => {
//     console.log(data);
// });

data.forEach((grade: ImportGrade) => {
    periodosIds = [];

    grade.periodos.forEach(importPeriodo);

    const gradeToBeCreated: Grade = {
        ano: grade.ano,
        curso: grade.curso,
        idGrade: grade.idGrade,
        periodos: periodosIds,
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

function importPeriodo(periodo: ImportPeriodo) {
    disciplinasIds = [];

    periodo.disciplinas.forEach(importDisciplina);

    const periodoToBeCreated: Periodo = {
        disciplinas: disciplinasIds,
        idPeriodo: periodo.idPeriodo,
        periodo: periodo.idPeriodo,
    };

    insertPeriodo(periodoToBeCreated)
        .then(({ data }) => {
            periodosIds.push(data._id);
        })
        .catch((err) => {
            console.error(err.response.data.message);
        });
}

function importDisciplina(disciplina: ImportDisciplina) {
    let toBeCreated: Disciplina = {} as Disciplina;

    if (disciplina.preRequisitos) {
        const requisitos: string[] = disciplina.preRequisitos.split('\n');
        toBeCreated.preRequisitos = [];

        requisitos.forEach((requisito) => {
            findDisciplina(requisito)
                .then(({ data }) => {
                    // console.log(data);
                    toBeCreated.preRequisitos!.push(data.data._id);
                })
                .catch((err) => {
                    throw err.response.data.message;
                });
        });
    }

    if (disciplina.coRequisito) {
        findDisciplina(disciplina.coRequisito)
            .then(({ data }) => {
                toBeCreated.coRequisito = data.data._id;
            })
            .catch((err) => {
                console.error(err.response.data.message);
            });
    }

    toBeCreated.nome = disciplina.nome;
    toBeCreated.codDisciplina = disciplina.codDisciplina;
    toBeCreated.cargaHoraria = disciplina.cargaHoraria;
    toBeCreated.ementa = disciplina.ementa;

    // console.log({
    //     codDisciplina: toBeCreated.codDisciplina,
    //     preRequisitos: toBeCreated.preRequisitos,
    // });

    insertDisciplina(toBeCreated)
        .then(({ data }) => {
            disciplinasIds.push(data._id);
        })
        .catch((err) => {
            throw err.response.data.message;
        });
}

/* --------------------------- Auxiliary functions -------------------------- */

async function getAllDisciplinas() {
    return await api.get('/disciplinas');
}

async function getAllGrades() {
    return await api.get('/grades');
}

async function getAllPeriodos() {
    return await api.get('/periodos');
}

async function insertDisciplina(disciplina: Disciplina) {
    // console.log(disciplina);
    return await api.post('/disciplinas', disciplina);
}

async function findDisciplina(codDisciplina: string) {
    return await api.post('/findDisciplina', { codDisciplina: codDisciplina });
}

async function insertGrade(grade: Grade) {
    return await api.post('/grades', grade);
}

async function insertPeriodo(periodo: Periodo) {
    return await api.post('/periodos', periodo);
}
