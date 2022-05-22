import TipoDespesa from "./../graphql/TipoDespesas.gql";
import apollo from "../../../../../plugins/apollo";
import despesaQuery from "./../graphql/Despesas.gql";
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

export default { tipoDespesas, despesas };
