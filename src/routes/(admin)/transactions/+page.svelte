<script lang="ts">
    import TransactionList from "$features/TransacrtionList/TransactionList.svelte";
    import {getTransactions} from "$entities/transaction";
	import {getExpensesCategories, getIncomeCategories, type TCategory} from "$entities/category";
	import {createAccount, getAccounts, type TAccount} from "$entities/account";


    let history = $state([])


   

    let incomingCategories: Array<TCategory> = $state([])
	let expenseCategories: Array<TCategory> = $state([])

	getIncomeCategories().then((res) => {
		incomingCategories = res;
	})

	getExpensesCategories().then((res) => {
		expenseCategories = res;
	})


	let accounts = $state<Array<TAccount>>([]);

	getAccounts().then(res => {
		accounts = res;
	})

    let account = $state('');

    let type = $state('');
    let category = $state('');
    let s = $state('');



    const search = async (account, category, type, s) => {
        getTransactions({
            account,
            category,
            type,
            search: s
        }).then(res => {

            history = res;
        });
    }

 

    $effect(() => {
       search(account, category, type, s);  
    });

</script>

<div class="card transaction-history card-yellow container">
    <div class="transaction-history--head">
        <h2 class="transaction-history--head_title">
            История транзакций
        </h2>
        <div class="transaction-history--head_searchBox">
            <select name="account" bind:value={account} id="">
                <option value="">Не выбрано</option>
                {#each accounts as account}
                    <option value="{account.id}">
                        {account.name}
                    </option>
                {/each}
            </select>
            <select name="type" bind:value={() => type, (value) => {type = value; category = ''}} id="">
                <option value="">Не выбрано</option>
                <option value='1'>
                    Доход
                </option>
                <option value='2'>
                    Расход
                </option>
            </select>
            {#if type == 1}
                <select name="" bind:value={category} id="">
                    <option value="">Не выбрано</option>
                    {#each incomingCategories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            {:else}
                <select name="" bind:value={category} id="">
                    <option value="">Не выбрано</option>
                    {#each expenseCategories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            {/if}
        </div>

    </div>
    <div>
        <TransactionList list={history}></TransactionList>
    </div>
</div>


<style>
    .transaction-history {

    }
    .transaction-history--head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .transaction-history--head_searchBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        column-gap: 10px;
    }
</style>
