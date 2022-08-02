import TipoDespesa from "./../graphql/TipoDespesas.gql";
import apollo from "../../../../../plugins/apollo";
import despesaQuery from "./../graphql/Despesas.gql";
import createDespesa from "./../graphql/createDespesa.gql";
import updateDespesa from "./../graphql/updateDespesa.gql";
import deleteDespesa from "./../graphql/deleteDespesa.gql";
const tipoDespesas = async (options = {}) => {
  const response = await apollo.query({
    query: TipoDespesa,
    ...options,
  });
  return response.data.tipoDespesas;
};

const despesas = async (variables) => {
  const response = await apollo.mutate({
    mutation: despesaQuery,
    variables,
  });
  return response.data.despesaRealizadas;
};
const UpdateDespesa = async (variables) => {
  variables.valor = parseFloat(variables.valor);
  const response = await apollo.mutate({
    mutation: updateDespesa,
    variables,
  });
  return response.data.updateDespesaRealizada;
};
const CreateDespesa = async (variables) => {
  variables.valor = parseFloat(variables.valor);
  variables.tipoId = variables.tipo.id;
  const response = await apollo.mutate({
    mutation: createDespesa,
    variables,
  });
  return response.data.createDespesaRealizada;
};
const DeleteDespesa = async (variables) => {
  variables.forEach(async (variables) => {
    const response = await apollo.mutate({
      mutation: deleteDespesa,
      variables,
    });
    return response.data.deleteDespesaRealizada;
  });
};
export default {
  tipoDespesas,
  despesas,
  CreateDespesa,
  UpdateDespesa,
  DeleteDespesa,
};
