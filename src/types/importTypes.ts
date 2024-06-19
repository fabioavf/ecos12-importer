export type Root = ImportGrade[];

export interface ImportGrade {
    idGrade: number;
    curso: string;
    ano: number;
    periodos: ImportPeriodo[];
}

export interface ImportPeriodo {
    idPeriodo: number;
    disciplinas: ImportDisciplina[];
}

export interface ImportDisciplina {
    codDisciplina: string;
    nome: string;
    cargaHoraria: number;
    preRequisitos?: string;
    coRequisito?: string;
    ementa: string;
}
