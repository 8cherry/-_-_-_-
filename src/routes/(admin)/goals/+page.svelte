<script lang="ts">
    import DatePicker from "../../../shared/DatePicker.svelte";
    import {createGoal, getGoals} from "$entities/goal";


    const defaultForm = {
        startDate: '',
        deadline: '',
        name: '',
        amount: '',
    };

    let  form = $state(defaultForm);

    let goals = $state([]);

    const fetchGoals = () => {
        getGoals().then(res => {
            goals = res;
            console.log(goals);
        })

    }

    const onSave = (event: SubmitEvent) => {
        event.preventDefault();

        createGoal(form).then(() => {
            fetchGoals()
        })
    }

    fetchGoals();
</script>

<div class="card card-pink container mb-2 color-green">
    <h2 style="margin-bottom: 20px">
        Добавление цели
    </h2>
    <form action="" onsubmit={onSave}>
        <div class="goal-form">
            <div class="goal-form--row" style="margin-bottom: 10px">
                <input type="text" placeholder="Название" bind:value={form.name}>
                <DatePicker placeholder="Дата начала" bind:value={form.startDate}></DatePicker>
            </div>
            <div class="goal-form--row">
                <input type="text" placeholder="Сумма" bind:value={form.amount}>
                <DatePicker  placeholder="Дата конца" bind:value={form.deadline}></DatePicker>
            </div>
        </div>
        <button type="submit">
            Добавить цель
        </button>
    </form>
</div>
<div class="card goals--block color-fiolet card-yellow container">
    <h2 class="goals--block--title">Все цели</h2>
    <div class="goals--block-view">
        {#each goals as goal}
        <div class="goals--block-view_card card color-pink card-fiolet">
            <h3>
                {goal.name}
            </h3>
            <p class="color-green">
                {goal.amount}
            </p>
            <h4>
                {(new Date(goal.deadline)).toLocaleDateString('ru-ru')}
            </h4>
        </div>
        {/each}

    </div>
</div>


<style>
    .card-pink {
        margin-bottom: 1rem;
    }
    .goals--block--title {
        margin-bottom: 20px;
    }

    .goals--block-view {

    }

    .goals--block-view_card {
        max-width: 300px;
    }

    .goal-form {
        margin-bottom: 20px;
    }

    .goal-form--row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
</style>
