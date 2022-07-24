import apollo from "../../../../../plugins/apollo";
import VendasQuery from "./../graphql/vendas.gql";

const vendas = async (variables) => {
  const response = await apollo.mutate({
    mutation: VendasQuery,
    variables,
  });
  response.data.vendaItems.map((data) => {
    data.total = data.Qtd * data.PrecoUnit;
  });
  return response.data.vendaItems;
};

export default {
  vendas,
};
