export type Disciplina = {
  codDisciplina: string;
  nome: string;
  cargaHoraria: number;
  ementa: string;
  preRequisitos?: string[];
  coRequisito?: string;
};

export type Grade = {
  idGrade: number;
  curso: string;
  ano: number;
  periodos: Periodo[] | string[];
};

export type Periodo = {
  idPeriodo: number;
  periodo: number;
  disciplinas: Disciplina[] | string[];
};
