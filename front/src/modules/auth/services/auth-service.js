import apollo, { onLogin } from "./../../../plugins/apollo";
import LoginMutation from "./../graphql/Login.gql";
import AgricultorQuery from "./../graphql/Agricultor.gql";
const login = async (variables) => {
  const response = await apollo.mutate({
    mutation: LoginMutation,
    variables,
  });
  const { login } = response.data;
  await onLogin(apollo, login.token);
  return response.data.login;
};

const agricultor = async (options = {}) => {
  const response = await apollo.query({
    query: AgricultorQuery,
    ...options,
  });
  return response.data.agricultor;
};

export default {
  login,
  agricultor,
};
