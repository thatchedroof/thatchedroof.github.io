//import * as fs from 'fs';
export const companyText = `P & P Paper	PPP		Shopping
Compton Auto	COMA		Auto
Ritzy Glitzy	RITZ	A movie chain established in 1923 hoping to break into streaming.	Web
Quabee	QUAB	A new streaming service based around short-form video content. What could go wrong?	Web
Beenz.com	BEEZ	Beenz will revolutionize the internet.	Web
J. Branson Auto Parts	BRAP	An auto parts company plagued by a scandal of backfiring engines.	Auto
Trona Motor	TRNA	A car company based out of the dead city of Trona, CA!	Auto
Woodcock Farm Fresh	COCK	Established in 1992, this health-oriented supermarket chain brands itself as "Est. 1882".	Shopping
Say His Name Ltd. 	SHNL		Web
Braxton	BRAX		Defense
Trent.com	TRNT	An online shopping marketplace which briefly took over the world, driven into failiure by a narcissistic CEO.	Shopping
Gnosis	GNOS	A solar energy company on the search for enlightenment.	Energy
Mercury Nix	MERC	A telecom company which refused to adopt 5G, and lost 50% of its market share.	Telecom
Avuncularity	UNCL		Health
Krzystof-Spratley	KRZY	Every soldier has a different interpretation of the pronounciation of this defense company's name.	Defense
Smith Smith Medical	SSMD		Health
Fresno Auto Corp	FRES	The launch of the Nightcrawler SUV was immediately followed by an emmisions test scandal. Oops!	Auto
Xenia	XENI	This once-hegemony was broken up into a bunch of impotent tech companies. All but one went bankrupt.	Tech
Dexter-Newcastle Coal Company	XNEW	This company started up by selling coal to Newcastle, England. This strategy has not done well for them.	Energy
Calumny Energy	CLMN	The cowboy-hat wearing CEO repeatedly refuses to acknowedge claims of workplace abuse.	Energy
Big Boy Co. 	BBC		Food
Aaaugh! Foods	AAA	A new jersey-based conglomerate owning a bunch of off-brand snack food companies and one arms manufacturer.	Shopping
Susan-Young	SUSY	Founded by James Susan and Alfred Young, this old-world telecom company pioneered the development of the first telephone.	Telecom
American Naturalism Group	AMNG	This agricultural empire previously owned 45% of the land in Guatemala, and are responsible for 5 known massacres. 	Food
United Sales Service	USS		Shopping
Fedora State	FEDS		Health
Media-Induced Studios	MEDI	Media-Induced Studios is the web's leading purrveyor of Third-Order content. Download it to your brain today!	Web
Ffgwuu Ltd.	FFGW	Headed by an enigmatic CEO; nobody knows what this company truly produces. Ffgwuu sus vurp.	Tech
Medbay	MEDB	One "bad doctor" botches a surgery, and your whole company is under fire! No, it wasn't a systematic issue!	Health
Opposite Stripes	STRP		Tech
Antidiagonal	ANTI		Tech
Enscription	ENSC		Telecom
Shared Item & Trust	SHIT		Banking
Changed Ltd.	CHNG	This chain of plastic surgery clinics led by CEO and figurehead Dr. K will help you change into any form you want.	Health
Medmenham Monk Club	MEMC		Banking
Sade 120	SADE		Banking
Greeked!	GREK	Walking into Greeked! feels like walking into a parrallel universe. The brands all feel familiar, but you can't recognize any of them.	Shopping
30 Yrs. Bakery	YRSB	This Seattle-based bakery creates many healthful and organic baked goods. Their products can't, however, help you forget what happened 30 years ago. You can't forget.	Food
Love Is A Lie	LIAL		Web
Father's Eatery	FATE		Food
Gregory 2/22	GREG	A bourgie supermarket chain where everything is overpriced.	Shopping
Mike Hawk Technologies	MIKE		Defense
Showing Speed Auto	SHSP		Auto
Carfeet Tires 	FEET		Auto
Dallas Auto	DALL		Auto
GQa Solutions	GQAS		Tech
Jigsaw Gas & Oil	JIGG		Energy
Dugist Union	DUGU		Defense
T. Mazur Munitions	TMAZ		Defense
Do You Like Milk? Dairy Co.	DYLM		Food
Omicron Mart	OMIC		Shopping
Swaedish IPA Group	SWAE	The Swaedish IPA Group was formed as a cot/caught merger between two preexisting telecom companies.	Telecom
Trinity Rifle Company	TRIN	The Trinity Rifle Company's mainline product is the M23 Trinity. The M23 has dual-loading sidecar box mags, with shelled rifling and tank/air support.	Defense
Dziewięćsetdziewięćdziesięciodziewięcionarodowościowego	DZIE	Sorry.	Energy
Gvprtskvni	GVPR		Food
Colorless Green Ideas	COGI		Web
Bogo Jouissance	JOUI		Shopping
Bacchanal	BACC		Telecom
Soy Yo	SOYY		Health
Ahora Coméis	AHOR		Food
Can Of Worms	OWO		Defense
Cloth Mother 	CLOM		Energy
Paracelsus	SUS		Auto
Kirby Co.	KIRB		Defense
MorbiusWeb	MORB		Web
Buckley Animations	BUCK		Web
Hubbard-Jones	HUBB		Banking
L'histoire de l'œil	LHIS	This bank takes the logo of what looks like a severed eyeball in the shell of a clam.	Banking
Hastur Banking	HSUR		Banking
Bear Pizza House	BPZH		Food
Zephium American Natural Gas	ZAMN		Energy
Pornological Horse JPEG Club	PHJC		Web
Boy Eggs Unlimited	BEGG		Food
Balistyka twarzy wojak	WJAK		Defense
Saturn Toy Company	SATU		Shopping
CHIMERA	CHIM		???
Doughbite Industries	BYTE		Tech
American Standard Services	ASS		Banking
Wolfdragon	DRLF		Defense
Wassup Beijing!	WASS		Web
Bing Chilling	BING		Tech
Re-Sounding	RESO	A free-speech oriented alt social media platform mostly populated by Krankenwagen division Neo-Nazis.	Web
Jefferson Liquidaton Quality Banking Services	JELQ	This company offers to stretch out your finances by liquidating your assets.	Banking
Prisencolinensinainciusol	PRIS		Health`;
export const companies = companyText.split('\n').map(line => {
    return [...line.split('	'), ...[Math.round((Math.random() * 9.9 + .1) * 100) / 100, Math.round(Math.random() * 90000 + 10000)], 0];
});
console.log(companies);
export const chooseCompanies = (i) => companies.sort(() => .5 - Math.random()).slice(0, i);
// From https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export function normal() {
    var u = 0, v = 0;
    while (u === 0)
        u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0)
        v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
export const nextPrice = (p, interval, mean, sigma) => {
    return p * Math.exp((mean - ((sigma * sigma) / 2)) * interval + sigma * normal());
};
export const nextCompanyPrice = (c, interval, mean, sigma) => {
    return [c[0], c[1], c[2], c[3], nextPrice(c[4], interval, mean, sigma), c[5], c[6]];
};
export const addToStockHistory = (history, interval = undefined, mean = undefined, sigma = undefined) => {
    const last = history[history.length - 1];
    return history.concat([[
            last[0].map((c, i) => nextCompanyPrice(c, (interval != null ? interval : last[1]), (mean != null ? mean[i] : last[2][i]), (sigma != null ? sigma[i] : last[3][i]))),
            (interval !== null && interval !== void 0 ? interval : last[1]),
            (mean !== null && mean !== void 0 ? mean : last[2]),
            (sigma !== null && sigma !== void 0 ? sigma : last[3])
        ]]);
};
export const simulateStocks = (history, count = 1) => {
    if (count <= 0) {
        return history;
    }
    else {
        return simulateStocks(addToStockHistory(history), count - 1);
    }
};
export const changeStockOwnership = (history, i, change) => {
    const init = history.slice(0, -1);
    const [h, a, b, z] = history[history.length - 1];
    return init.concat([[h.map((c, j) => j !== i ? c : [c[0], c[1], c[2], c[3], c[4], c[5], c[6] + change]), a, b, z]]);
};
export const mu = new Array(10).fill(0.001);
export const sigma = new Array(10).fill(0.05);
//fs.writeFileSync('./stocks.json', JSON.stringify(simulateStocks([[chosenCompanies, 1, mu, sigma]], 91 * 4 * 10)));
