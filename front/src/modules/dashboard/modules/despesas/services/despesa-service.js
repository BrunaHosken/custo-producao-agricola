import TipoDespesa from "./../graphql/TipoDespesas.gql";
import apollo from "../../../../../plugins/apollo";

const tipoDespesas = async (options = {}) => {
  const response = await apollo.query({
    query: TipoDespesa,
    ...options,
  });
  return response.data.tipoDespesas;
};

export default { tipoDespesas };
