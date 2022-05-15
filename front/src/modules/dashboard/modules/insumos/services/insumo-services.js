import TipoInsumo from "./../graphql/TipoInsumos.gql";
import InsumoQuery from "./../graphql/Insumos.gql";
import apollo from "../../../../../plugins/apollo";

const tipoInsumos = async (options = {}) => {
  const response = await apollo.query({
    query: TipoInsumo,
    ...options,
  });
  return response.data.tipoInsumoes;
};
const insumos = async (options = {}) => {
  console.log("OI");
  const response = await apollo.query({
    query: InsumoQuery,
    ...options,
  });
  console.log(response);
  return response.data.insumoes;
};

export default { tipoInsumos, insumos };
