import { Order, Owner } from "@bity/api/models";

export function createOrder(): Order {
  const ibanNum = 'CH0400766000103138557';
  const order = new Order();
  return order
    .setInput('CHF', '50.00')
    .do((input) => input.setOwner(new Owner()).setIban(ibanNum))
    .setOutput('ETH', '50.00')
    .do((output) =>
      output.setCryptoAddress('0x8ED80CCF20F1E284eb56F2Ea225636F1aAC647Ce')
    );
}