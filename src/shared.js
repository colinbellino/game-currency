// TODO: Set this depending on user's prefered locale
const locale = "en-US";
const currencyFormatter = new Intl.NumberFormat(locale, { maximumSignificantDigits: 7 });

// Rates from: https://www.reddit.com/r/gaming/comments/725t5v/exchange_rates_of_video_game_currencies/
export const currencies = [
  { id: "euro", name: "Euro", rate: 1.0, icon: true },
  { id: "septim", name: "Septim (Skyrim)", rate: 0.24833, icon: true },
  { id: "cap", name: "Caps (Fallout)", rate: 0.61875, icon: true },
  { id: "buckazoid", name: "Buckazoids (Space Quest)", rate: 0.54143, icon: false },
  { id: "banana_coin", name: "Banana Coin (Donkey Kong Country)", rate: 0.08950, icon: true },
  { id: "linden_dollar", name: "Linden Dollar (Second Life)", rate: 0.00326, icon: false },
  { id: "mineral", name: "Mineral (StarCraft)", rate: 34722222.22222, icon: true },
  { id: "bullet", name: "Bullet (Metro 2033)", rate: 0.79900, icon: false },
  { id: "soul", name: "Soul (Demon's Souls)", rate: 0.01990, icon: true },
  { id: "isk", name: "ISK (Eve Online)", rate: 0.00000003166666666666772, icon: true },
  { id: "bell", name: "Bells (Animal Crossing)", rate: 0.02328, icon: true },
  { id: "gold", name: "Gold (World of Warcraft)", rate: 0.00092, icon: true },
  { id: "poke_dollar", name: "Poke Dollar (Pokémon Red/Blue)", rate: 0.00049, icon: true },
  { id: "emerald", name: "Emerald (Minecraft)", rate: 37.49531, icon: true },
  { id: "simoleon", name: "Simoleon (The Sims)", rate: 	0.17475, icon: true },
  { id: "credit", name: "Credit (Mass Effect)", rate: 0.15980, icon: true },
  { id: "rupee", name: "Rupee (Zelda)", rate: 0.09633, icon: true },
  { id: "coin", name: "Coin (Super Mario Bros.)", rate: 100000, icon: true },
  { id: "nanite", name: "Nanite (System Shock 2)", rate: 1.0, icon: false },
  { id: "silver_eagle", name: "Silver Eagle (Bioshock Infinite)", rate: 0.58125, icon: true },
];

export function renderResult(sourceCurrency, targetCurrency, amount, result) {
  return `${amount} ${sourceCurrency.name} = <b>${currencyFormatter.format(result)} ${targetCurrency.name}</b></h2>`;
}

export function parseData(input) {
  const originalAmount = input.amount;
  const amount = Number(originalAmount);
  if (isNaN(amount)) {
    return [{ message: "Invalid amount." }, {}];
  }

  const source = parseInt(input.source);
  if (isNaN(source)) {
    return [{ message: "Invalid source." }, {}];
  }

  const target = parseInt(input.target);
  if (isNaN(target)) {
    return [{ message: "Invalid target." }, {}];
  }

  return [null, { originalAmount, amount, source, target }];
}

export function validate(input) {
  if (input.amount > 1_000_000_000_000) {
    return { message: "Amount too large." };
  }

  if (input.amount < -1_000_000_000_000) {
    return { message: "Amount too small." };
  }

  if (input.source < 0 || input.source > currencies.length - 1) {
    return { message: "Invalid source currency." };
  }

  if (input.target < 0 || input.target > currencies.length - 1) {
    return { message: "Invalid target currency." };
  }

  return null;
}

export function calculateResult(amount, sourceRate, targetRate) {
  return amount * sourceRate / targetRate;
}

export function renderCurrencySelect(name, value, label, currencies) {
  return `
    <label>
      <span>${label}</span>
      <div class="select-with-icon">
        <img src="${getCurrencyURL(currencies[value])}" class="select-icon" aria-hidden="true">
        <select name="${name}">
          ${currencies.map((currency, currencyIndex) => `<option value="${currencyIndex}" ${currencyIndex == value ? "selected" : ""}>${currency.name}</option>`).join("\n")}
        </select>
      </div>
    </label>
  `;
}

export function getCurrencyURL(currency) {
  if (currency.icon) {
    return `/public/images/128x128/${currency.id}.jpg`;
  }
  return "/public/images/empty.png";
}
