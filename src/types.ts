export type StatusFuncionario = "ativo" | "inativo";

export type Sexo = "feminino" | "masculino";

// Catálogos — recursos próprios (GET /cargos, /atividades, /epis).
// Funcionário/atividade guardam apenas o id, nunca o rótulo.
export interface Cargo {
    id: string;
    nome: string;
}

export interface Atividade {
    id: string;
    nome: string;
}

export interface Epi {
    id: string;
    nome: string;
}

// Um EPI vinculado a uma atividade específica (com número do CA)
export interface EpiDaAtividade {
    id: string;
    epiId: string;
    numeroCA: string;
}

// Uma atividade com a lista de EPIs usados nela (estrutura do formulário)
export interface AtividadeDetalhada {
    id: string;
    atividadeId: string;
    epis: EpiDaAtividade[];
}

export interface Funcionario {
    id: string;
    nomeCompleto: string;
    sexo?: Sexo;
    cpf: string;
    dataNascimento?: string;
    rg?: string;
    cargoId: string;
    status: StatusFuncionario;

    naoUsaEpi?: boolean;
    atividadesDetalhadas?: AtividadeDetalhada[];
    atestadoSaude?: string;
}

export type FuncionarioInput = Omit<Funcionario, "id">;
