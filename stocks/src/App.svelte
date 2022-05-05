<script lang="ts">
    import CompanyIcon from '../components/CompanyIcon.svelte';
    import { playerMoney, companies } from './stores.js';

    const company = (
        name: string,
        ticker: string,
        desc: string,
        sector: string,
        price: number,
    ) => ({
        name,
        ticker,
        desc,
        sector,
        price,
    });

    let money: number;

    playerMoney.subscribe((value) => {
        money = value;
    });

    let companyInfo: Company[];

    companies.subscribe((value) => {
        companyInfo = value;
    });
</script>

<main>
    <p>Current Money: {money}</p>
    <CompanyIcon company={companyInfo[0]} />
</main>

<style>
</style>
