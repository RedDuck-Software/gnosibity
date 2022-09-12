import { Order, Owner } from "@bity/api/models";

export function createOrder(cryptoAddress: string | undefined): Order {
  if (typeof cryptoAddress === 'undefined')
    return new Order()
  const ibanNum = 'CH0400766000103138557';
  const order = new Order();
  return order
    .setInput('CHF', '50.00')
    .do((input) => input.setOwner(new Owner()).setIban(ibanNum))
    .setOutput('ETH', '50.00')
    .do((output) =>
      output.setCryptoAddress(cryptoAddress)
    );
}
