export interface ReturnDisciplina {
    data: Disciplina;
}

interface Disciplina {
    _id: string;
    codDisciplina: string;
    nome: string;
    cargaHoraria: number;
    ementa: string;
    preRequisitos: any[];
    __v: number;
}
