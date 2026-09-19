import { useState } from "react";
import {
    Form,
    Input,
    Radio,
    Select,
    Checkbox,
    Switch,
    Button,
    Upload,
    DatePicker,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs, { type Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { atualizarFuncionario, criarFuncionario } from "./funcionarioSlice";
import { selectCargos } from "../cargos/cargosSlice";
import { selectAtividadesOpcoes } from "../atividades/atividadesSlice";
import { selectEpisOpcoes } from "../epis/episSlice";
import type { AtividadeDetalhada, Funcionario, Sexo } from "../../types";
import "./FuncionarioForm.css";

let contadorId = 0;
function gerarId(prefixo: string): string {
    contadorId += 1;
    return `${prefixo}-${Date.now()}-${contadorId}`;
}

// Validador de CPF (formato + dígitos verificadores)
function validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) return false;

    const calcularDigito = (base: string, pesoInicial: number) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base[i], 10) * (pesoInicial - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const digito1 = calcularDigito(numeros.slice(0, 9), 10);
    const digito2 = calcularDigito(numeros.slice(0, 10), 11);
    return (
        digito1 === parseInt(numeros[9], 10) &&
        digito2 === parseInt(numeros[10], 10)
    );
}

function mascararCPF(valor: string): string {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

interface Props {
    funcionario: Funcionario | null;
}

interface EpiFormValue {
    epiId?: string;
    numeroCA: string;
}

interface AtividadeFormValue {
    atividadeId?: string;
    epis: EpiFormValue[];
}

interface FormValues {
    nomeCompleto: string;
    sexo: Sexo;
    cpf: string;
    dataNascimento: Dayjs;
    rg: string;
    cargoId: string;
    ativo: boolean;
    naoUsaEpi: boolean;
    atividades: AtividadeFormValue[];
}

export function FuncionarioForm({ funcionario }: Props) {
    const dispatch = useAppDispatch();
    const cargos = useAppSelector(selectCargos);
    const opcoesAtividade = useAppSelector(selectAtividadesOpcoes);
    const opcoesEpi = useAppSelector(selectEpisOpcoes);
    const emEdicao = funcionario;

    const [form] = Form.useForm<FormValues>();
    const naoUsaEpi = Form.useWatch("naoUsaEpi", form);

    const [arquivoAtestado, setArquivoAtestado] = useState<UploadFile[]>(
        emEdicao?.atestadoSaude
            ? [{ uid: "-1", name: emEdicao.atestadoSaude, status: "done" }]
            : [],
    );

    const initialValues: Partial<FormValues> = {
        nomeCompleto: emEdicao?.nomeCompleto ?? "",
        sexo: emEdicao?.sexo,
        cpf: emEdicao?.cpf ?? "",
        dataNascimento: emEdicao?.dataNascimento
            ? dayjs(emEdicao.dataNascimento)
            : undefined,
        rg: emEdicao?.rg ?? "",
        cargoId: emEdicao?.cargoId ?? undefined,
        ativo: emEdicao ? emEdicao.status === "ativo" : true,
        naoUsaEpi: emEdicao?.naoUsaEpi ?? false,
        atividades:
            emEdicao?.atividadesDetalhadas &&
            emEdicao.atividadesDetalhadas.length > 0
                ? emEdicao.atividadesDetalhadas.map((a) => ({
                      atividadeId: a.atividadeId,
                      epis: a.epis.map((e) => ({
                          epiId: e.epiId,
                          numeroCA: e.numeroCA,
                      })),
                  }))
                : [
                      {
                          atividadeId: undefined,
                          epis: [{ epiId: undefined, numeroCA: "" }],
                      },
                  ],
    };

    const handleFinish = (values: FormValues) => {
        const atividadesValidas: AtividadeDetalhada[] = values.naoUsaEpi
            ? []
            : (values.atividades ?? [])
                  .filter((a): a is typeof a & { atividadeId: string } =>
                      Boolean(a.atividadeId),
                  )
                  .map((a) => ({
                      id: gerarId("ativ"),
                      atividadeId: a.atividadeId,
                      epis: (a.epis ?? [])
                          .filter(
                              (
                                  e,
                              ): e is typeof e & {
                                  epiId: string;
                                  numeroCA: string;
                              } =>
                                  Boolean(e.epiId) &&
                                  Boolean(e.numeroCA?.trim()),
                          )
                          .map((e) => ({
                              id: gerarId("epi"),
                              epiId: e.epiId,
                              numeroCA: e.numeroCA,
                          })),
                  }));

        const dadosComuns = {
            nomeCompleto: values.nomeCompleto.trim(),
            sexo: values.sexo,
            cpf: values.cpf,
            dataNascimento: values.dataNascimento
                ? values.dataNascimento.format("YYYY-MM-DD")
                : "",
            rg: values.rg.trim(),
            cargoId: values.cargoId,
            status: values.ativo ? ("ativo" as const) : ("inativo" as const),
            naoUsaEpi: values.naoUsaEpi,
            atividadesDetalhadas: atividadesValidas,
            atestadoSaude: values.naoUsaEpi
                ? undefined
                : arquivoAtestado[0]?.name,
        };

        if (emEdicao) {
            dispatch(atualizarFuncionario({ ...emEdicao, ...dadosComuns }));
        } else {
            dispatch(criarFuncionario(dadosComuns));
        }
    };

    return (
        <Form
            form={form}
            className="func-form"
            layout="vertical"
            requiredMark={false}
            initialValues={initialValues}
            onFinish={handleFinish}
        >
            {/* Sector 1: status + dados pessoais */}
            <div className="func-form__group">
                <div className="func-form__row func-form__row--status">
                    <p className="func-form__label func-form__label--inline">
                        O trabalhador está ativo ou inativo?
                    </p>
                    <Form.Item name="ativo" valuePropName="checked" noStyle>
                        <Switch
                            checkedChildren="Ativo"
                            unCheckedChildren="Inativo"
                            className="custom-switch"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="func-form__group func-form__grid">
                <div className="func-form__grid-row">
                    <Form.Item
                        className="func-form__field"
                        label="Nome"
                        name="nomeCompleto"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value &&
                                    value.trim().length >= 5 &&
                                    /\s/.test(value.trim())
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error(
                                                  "Informe o nome completo (nome e sobrenome)",
                                              ),
                                          ),
                            },
                        ]}
                    >
                        <Input placeholder="Nome completo" />
                    </Form.Item>

                    <Form.Item
                        className="func-form__field"
                        label="Sexo"
                        name="sexo"
                        rules={[
                            { required: true, message: "Selecione o sexo" },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="feminino">Feminino</Radio>
                            <Radio value="masculino">Masculino</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>

                <div className="func-form__grid-row">
                    <Form.Item
                        className="func-form__field"
                        label="CPF"
                        name="cpf"
                        normalize={mascararCPF}
                        rules={[
                            {
                                validator: (_, value) =>
                                    value && validarCPF(value)
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error("CPF inválido"),
                                          ),
                            },
                        ]}
                    >
                        <Input placeholder="000.000.000-00" maxLength={14} />
                    </Form.Item>

                    <Form.Item
                        className="func-form__field"
                        label="Data de Nascimento"
                        name="dataNascimento"
                        rules={[
                            {
                                required: true,
                                message: "Informe a data de nascimento",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            placeholder="Selecione"
                        />
                    </Form.Item>
                </div>

                <div className="func-form__grid-row">
                    <Form.Item
                        className="func-form__field"
                        label="RG"
                        name="rg"
                        rules={[{ required: true, message: "Informe o RG" }]}
                    >
                        <Input placeholder="00.000.000-0" />
                    </Form.Item>

                    <Form.Item
                        className="func-form__field"
                        label="Cargo"
                        name="cargoId"
                        rules={[
                            {
                                required: true,
                                message: "Selecione o cargo",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Selecione"
                            options={cargos.map((c) => ({
                                value: c.id,
                                label: c.nome,
                            }))}
                        />
                    </Form.Item>
                </div>
            </div>

            {/* Sector EPIs */}
            <div className="func-form__group">
                <div className="func-form__epi-header">
                    <p className="func-form__label">
                        Quais EPIs o trabalhador usa na atividade?
                    </p>
                    <Form.Item name="naoUsaEpi" valuePropName="checked" noStyle>
                        <Checkbox>O trabalhador não usa EPI.</Checkbox>
                    </Form.Item>
                </div>

                {!naoUsaEpi && (
                    <Form.List name="atividades">
                        {(fields, { add, remove }) => (
                            <div className="func-form__atividades">
                                {fields.map((field) => (
                                    <div
                                        className="func-form__group func-form__atividade-block"
                                        key={field.key}
                                    >
                                        <Form.Item
                                            className="func-form__field func-form__field--full"
                                            label="Selecione a atividade:"
                                            name={[field.name, "atividadeId"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Selecione a atividade",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Selecione"
                                                options={opcoesAtividade.map(
                                                    (o) => ({
                                                        value: o.id,
                                                        label: o.nome,
                                                    }),
                                                )}
                                            />
                                        </Form.Item>

                                        <Form.List name={[field.name, "epis"]}>
                                            {(
                                                epiFields,
                                                {
                                                    add: addEpi,
                                                    remove: removeEpi,
                                                },
                                            ) => (
                                                <>
                                                    {epiFields.map(
                                                        (
                                                            epiField,
                                                            epiIndex,
                                                        ) => {
                                                            const isUltimo =
                                                                epiIndex ===
                                                                epiFields.length -
                                                                    1;

                                                            return (
                                                                <div
                                                                    className="func-form__epi-row"
                                                                    key={
                                                                        epiField.key
                                                                    }
                                                                >
                                                                    <Form.Item
                                                                        className="func-form__field"
                                                                        label="Selecione o EPI:"
                                                                        name={[
                                                                            epiField.name,
                                                                            "epiId",
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    "Selecione o EPI",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Select
                                                                            placeholder="Selecione"
                                                                            options={opcoesEpi.map(
                                                                                (
                                                                                    o,
                                                                                ) => ({
                                                                                    value: o.id,
                                                                                    label: o.nome,
                                                                                }),
                                                                            )}
                                                                        />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        className="func-form__field"
                                                                        label="Informe o número do CA:"
                                                                        name={[
                                                                            epiField.name,
                                                                            "numeroCA",
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    "Informe o CA",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input
                                                                            className="func-form__input--ca"
                                                                            placeholder="0000"
                                                                        />
                                                                    </Form.Item>

                                                                    {isUltimo ? (
                                                                        <Button
                                                                            className="btn btn--outline"
                                                                            onClick={() =>
                                                                                addEpi(
                                                                                    {
                                                                                        epiId: "",
                                                                                        numeroCA:
                                                                                            "",
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            Adicionar
                                                                            EPI
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            danger
                                                                            className="btn btn--outline"
                                                                            onClick={() =>
                                                                                removeEpi(
                                                                                    epiField.name,
                                                                                )
                                                                            }
                                                                        >
                                                                            Excluir
                                                                            EPI
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </>
                                            )}
                                        </Form.List>

                                        {fields.length > 1 && (
                                            <Button
                                                danger
                                                block
                                                className="btn btn--outline"
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            >
                                                Excluir Atividade
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    block
                                    className="btn btn--outline"
                                    onClick={() =>
                                        add({
                                            atividadeId: "",
                                            epis: [{ epiId: "", numeroCA: "" }],
                                        })
                                    }
                                >
                                    Adicionar outra atividade
                                </Button>
                            </div>
                        )}
                    </Form.List>
                )}
            </div>

            {/* Sector Atestado de Saúde */}
            {!naoUsaEpi && (
                <div className="func-form__group">
                    <p className="func-form__label">
                        Adicione Atestado de Saúde (opcional):
                    </p>
                    <Upload
                        listType="text"
                        beforeUpload={() => false}
                        fileList={arquivoAtestado}
                        maxCount={1}
                        onChange={({ fileList }) =>
                            setArquivoAtestado(fileList)
                        }
                        className={
                            "func-form__upload" +
                            (arquivoAtestado.length > 0 ? "" : " upload-empty")
                        }
                    >
                        <Button block className="btn btn--outline">
                            Selecionar arquivo
                        </Button>
                    </Upload>
                </div>
            )}

            <Button
                htmlType="submit"
                block
                className="btn btn--outline func-form__btn-submit"
            >
                Salvar
            </Button>
        </Form>
    );
}
