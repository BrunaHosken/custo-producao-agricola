import apollo from "../../../../../plugins/apollo";
import ServicoQuery from "./../graphql/Servico.gql";
import createServico from "./../graphql/createServico.gql";
import deleteServico from "./../graphql/deleteServico.gql";
import updateServico from "./../graphql/updateServico.gql";
const servico = async (options = {}) => {
  const response = await apollo.query({
    query: ServicoQuery,
    ...options,
  });

  return response.data.servicoes;
};

const CreateServico = async (variables) => {
  variables.valor = parseFloat(variables.valor);
  const response = await apollo.mutate({
    mutation: createServico,
    variables,
  });
  return response.data.createServico;
};
const DeleteServico = async (variables) => {
  variables.forEach(async (variables) => {
    const response = await apollo.mutate({
      mutation: deleteServico,
      variables,
    });
    return response;
  });
};
const UpdateServico = async (variables) => {
  console.log(variables);
  variables.valor = parseFloat(variables.valor);
  const response = await apollo.mutate({
    mutation: updateServico,
    variables,
  });
  return response.data.updateServico;
};
export default {
  servico,
  CreateServico,
  DeleteServico,
  UpdateServico,
};
