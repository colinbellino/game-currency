// TODO: Set this depending on user's prefered locale
const locale = "en-US";
const currencyFormatter = new Intl.NumberFormat(locale, { maximumSignificantDigits: 20 });

// Placeholder data from: https://www.reddit.com/r/gaming/comments/725t5v/exchange_rates_of_video_game_currencies/
// FIXME: These rates are in € but we use them as if they were in USD !
export const currencies = [
    { id: "us_dollar", name: "US Dollar", rate: 1.0 },
    { id: "euro", name: "Euro", rate: 1.223093 },
    { id: "mineral_starcraft_1", name: "Mineral (StarCraft)", rate: 34722222.22222 },
    { id: "coin_super_mario_bros", name: "Coin (Super Mario Bros.)", rate: 100000 },
    { id: "poke_dollar_pokemon_red", name: "Poke Dollar (Pokémon Red/Blue)", rate: 0.00049 },
    { id: "rupee_zelda_1", name: "Rupee (Zelda)", rate: 0.09633 },
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