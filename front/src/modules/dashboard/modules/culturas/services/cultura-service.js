import apollo from "../../../../../plugins/apollo";
import CulturaQuery from "./../graphql/Cultura.gql";
import createCultura from "./../graphql/createCultura.gql";
import deleteCultura from "./../graphql/deleteCultura.gql";
import updateCultura from "./../graphql/updateCultura.gql";
const cultura = async (options = {}) => {
  const response = await apollo.query({
    query: CulturaQuery,
    ...options,
  });
  return response.data.culturas;
};

const CreateCultura = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  const response = await apollo.mutate({
    mutation: createCultura,
    variables,
  });
  return response.data.createCultura;
};
const DeleteCultura = async (variables) => {
  variables.forEach(async (variables) => {
    const response = await apollo.mutate({
      mutation: deleteCultura,
      variables,
    });
    return response;
  });
};
const UpdateCultura = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  const response = await apollo.mutate({
    mutation: updateCultura,
    variables,
  });
  return response.data.updateCultura;
};
export default {
  cultura,
  CreateCultura,
  DeleteCultura,
  UpdateCultura,
};
