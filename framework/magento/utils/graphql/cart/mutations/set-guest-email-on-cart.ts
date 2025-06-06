const setGuestEmailOnCartMutation = `
  mutation setGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: {
      cart_id: $cartId,
      email: $email
    }) {
      cart {
        id
      }
    }
  }
`;

export default setGuestEmailOnCartMutation;
