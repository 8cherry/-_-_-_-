<script lang="ts">
    import Chart from 'chart.js/auto';
    import type {Action} from "svelte/action";
    import TransactionList from "$features/TransacrtionList/TransactionList.svelte";
    import {getTransactions} from "$entities/transaction";
    import DatePicker from "$shared/DatePicker.svelte";

    let formTransaction = $state(1);

    let start = $state('');
    let end = $state('');

    let history = $state([])

/*
    const data = [
        { year: 2024, mounth: 5, count: 10000 },
        { year: 2024, mounth: 6, count: 55000 },
        { year: 2024, mounth: 7, count: 100000 },
        { year: 2024, mounth: 8, count: 40000 },
        { year: 2024, mounth: 9, count: 60000 },
        { year: 2024, mounth: 10, count: 80000 },
        { year: 2024, mounth: 11, count: 70000 },
    ];
*/


    let doh = $state([]);
    let ras = $state([]);


    getTransactions({
            type: 1,
        }).then(res => {doh = res})

        getTransactions({
            type: 2,
        }).then(res => {ras = res})


    let sor = $derived(() => {
        let t1 = 0, t2 = 0;

        doh.forEach(item => t1 += Number(item.amount))
        ras.forEach(item => t2 += Number(item.amount))

        let t3p = (t1 + t2) / 100;

        return [t1 / t3p, t2 / t3p];
    })

    let data  = $state([]);

    let obj = $state({});


    

       
    const search = async (type, start, end) => {
        getTransactions({
            type,
            start,
            end,
        }).then(res => {

            history = res;
            console.log(res);
            
            data = res.reduce((acum, item) => {
                let date = new Date(item.date);
                
                let findCur = acum.find((c) => {
                    return c.year == date.getFullYear() && c.mounth == date.getMonth() && c.day == date.getDay();
                })
                
                if (findCur) {
                    findCur.count += Number(item.amount);
                } else {
                    acum.push({
                        day: date.getDay(),
                        mounth: date.getMonth(),
                        year: date.getFullYear(),
                        count: Number(item.amount)
                    });
                }
                return acum
            }, []);


            let total = 0;

            history.forEach((item) => {
                let catName = item.Category?.name;
                if (!(catName in obj)) {
                    obj[catName] = 0
                }

                total  += item.amount;
                
                obj[catName] += item.amount;
            })

            let percent = total / 100;

            for (let a in obj) {
                obj[a] = obj[a] / percent;  
            }


            
            console.log(data);

        });
    }


    $effect(() => {
        search(formTransaction, start, end);
    })



    let chartSource = null;

    const renderChartSource: Action = (node) => {
        $effect(() => {
            if (chartSource !== null) {
                chartSource.destroy();
            }

            
            // Array.from(history.reduce((acum, item) => {

            //     acum.add(item.Category?.name)

            //     return acum;
            //     }, new Set()))

            chartSource = new Chart(
            node,
            {
                type: 'pie',
                data: {
                    labels: Object.keys(obj),
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: Object.values(obj),
                        }
                    ]
                }
            }
        );
        })
    }

    let chartRatio = null;

    const renderChartRatio: Action = (node) => {
        $effect(() => {
            if (chartRatio !== null) {
                chartRatio.destroy();
            }

            chartRatio = new Chart(
            node,
            {
                type: 'pie',
                data: {
                    labels: ['Расходы', 'Доходы'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: sor(),
                        }
                    ]
                }
            }
        );
        });
    }

    let chart = null;
    let chartNode = null;

    const renderChart: Action = (node) => {
        $effect(() => {
            if (chart !== null) {
                chart.destroy();
            }

            chart = new Chart(
                node,
                {
                    type: 'bar',
                    data: {
                        labels: data.map(row => row.year + '.'+ row.mounth+'.'+row.day),
                        datasets: [
                            {
                                label: formTransaction == 1 ? 'Доходы' : 'Расход',
                                backgroundColor: formTransaction == 1 ? '#8FE5BE' : "#FB97A3",
                                data: data.map(row => row.count )
                            }
                        ]
                    }
                }
            );
            
        });
    }

</script>
<div class="container">
    <div style="margin-bottom: 2rem">
        <button  class={{'btn-active': formTransaction == 1, "doh": true }} onclick={formTransaction = 1}>Доход</button>
        <button  onclick={formTransaction = 2} class={{'btn-active': formTransaction == 2, "rash": true }} >Расход</button>
        <DatePicker  bind:value={start} placeholder="Начало периода" > </DatePicker>
        <DatePicker bind:value={end}  placeholder="Конец периода" > </DatePicker>
    </div>
    <div class="card card-green color-fiolet ">
        <h3>
            Динамика доходов
        </h3>
        <canvas id="acquisitions" use:renderChart></canvas>
    </div>

    <div class="second-screen row">
        <div class="second-screen-card card card-pink">
            <TransactionList list={history}>

            </TransactionList>
        </div>
        <div class="second-screen-card card card-pink">
            <h4>
                Источники дохода
            </h4>
            <canvas id="two" use:renderChartSource></canvas>
            <h4>
                Соотношение доходов и расходов
            </h4>
            <canvas id="three" use:renderChartRatio></canvas>

        </div>
    </div>
</div>

<style>

    .btn-active {
        background-color: var(--color-fiolet);
        color: black;
    }

    h3 {
        margin-top: 0;
    }
    .second-screen {
        margin-top: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
        column-gap: 2rem;
    }
    .second-screen-card {
        width: 50%;
    }
</style>
