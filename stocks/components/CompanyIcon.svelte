<script lang="ts">
    export let company: Company;
</script>

<div class="area">
    <div class="title">
        <span class="ticker">{company.ticker}</span>
    </div>
    <div class="price">
        <span class="value">{company.price}</span>
    </div>
</div>

<style>
    .area {
        border-radius: 25px;
        border-collapse: seperate;
        overflow: hidden;
        width: 200px;
    }

    .title {
        background: #73ad21;
        padding: 20px;
        font-size: 1.5em;
        font-weight: bold;
        text-align: center;
    }

    .ticker {
        font-size: 1.5em;
        font-weight: bold;
        text-align: center;
    }

    .price {
        padding: 20px;
        background: #5d7739;
        size: auto;
        font-size: 1.5em;
        font-weight: bold;
    }
</style>
