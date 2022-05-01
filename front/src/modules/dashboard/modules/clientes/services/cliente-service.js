import apollo from "../../../../../plugins/apollo";
import ClienteQuery from "./../graphql/Cliente.gql";
import createCliente from "./../graphql/createCliente.gql";
import deleteCliente from "./../graphql/deleteCliente.gql";
import updateCliente from "./../graphql/updateCliente.gql";
const cliente = async (options = {}) => {
  const response = await apollo.query({
    query: ClienteQuery,
    ...options,
  });
  return response.data.clientes;
};

const CreateCliente = async (variables) => {
  console.log(variables);
  const response = await apollo.mutate({
    mutation: createCliente,
    variables,
  });
  return response.data.createCliente;
};
const DeleteCliente = async (variables) => {
  variables.forEach(async (item) => {
    console.log(item);
    const response = await apollo.mutate({
      mutation: deleteCliente,
      item,
    });
    return response;
  });
};
const UpdateCliente = async (variables) => {
  console.log(variables);
  const response = await apollo.mutate({
    mutation: updateCliente,
    variables,
  });
  return response.data.updateCliente;
};
export default {
  cliente,
  CreateCliente,
  DeleteCliente,
  UpdateCliente,
};
