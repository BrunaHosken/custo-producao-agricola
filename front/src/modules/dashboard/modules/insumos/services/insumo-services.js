import TipoInsumo from "./../graphql/TipoInsumos.gql";
import InsumoQuery from "./../graphql/Insumos.gql";
import createInsumo from "./../graphql/createInsumo.gql";
import updateInsumo from "./../graphql/updateInsumo.gql";
import deleteInsumo from "./../graphql/deleteInsumo.gql";
import apollo from "../../../../../plugins/apollo";

const tipoInsumos = async (options = {}) => {
  const response = await apollo.query({
    query: TipoInsumo,
    ...options,
  });
  return response.data.tipoInsumoes;
};
const insumos = async (options = {}) => {
  const response = await apollo.query({
    query: InsumoQuery,
    ...options,
  });
  return response.data.insumoes;
};
const CreateInsumo = async (variables) => {
  variables.valor = parseFloat(variables.valor);
  variables.tipo = variables.tipo.id;
  console.log(variables);
  const response = await apollo.mutate({
    mutation: createInsumo,
    variables,
  });
  return response.data.createInsumo;
};
const UpdateInsumo = async (variables) => {
  variables.valor = parseFloat(variables.valor);
  const response = await apollo.mutate({
    mutation: updateInsumo,
    variables,
  });
  return response.data.updateInsumo;
};

const DeleteInsumo = async (variables) => {
  variables.forEach(async (variables) => {
    const response = await apollo.mutate({
      mutation: deleteInsumo,
      variables,
    });
    return response;
  });
};
export default {
  tipoInsumos,
  insumos,
  CreateInsumo,
  UpdateInsumo,
  DeleteInsumo,
};
