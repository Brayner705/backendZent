// ngOnInit(): void {

//     // Set totalWeek to 0 when history is empty 

//     // current Week
//     const semanaDetectada = this.test(this.date);

//     this.currentWeek.set(semanaDetectada - 1);

//     console.log(`Estamos en la semana de calendario: ${semanaDetectada}`);
//     console.log(`Índice seleccionado para el gráfico: ${this.currentWeek()}`);

//     localStorage.setItem('currentWeek', this.currentWeek().toString());

//     for (let i = 0; i < this.totalWeek.length; i++) {
//       const value = parseInt(localStorage.getItem(`week${i + 1}`) || '');

//       if (value) this.totalWeek[i].money.set(value);
//     }

//     this.currentWeek.set(parseInt(localStorage.getItem('currentWeek') || '0'));

//     this.totalMoneyIncome = parseInt(localStorage.getItem('totalIncome') ?? '0');
//     this.api.getLastHistory().subscribe({
//       next: () => {
//         this.currentBalanceShow = currentBalance;
//       },
//       error: (err) => {
//         if (err.status === 404 || err.status === 500) this.existIncome = false;
//       },
//     });
//     this.updateIncome();

//     // Reset Week
//     const todayString = this.date.toDateString();

//     const lastUpdate = localStorage.getItem('lastWeekUpdate');

//     if (this.date.getDay() == 1 && lastUpdate != todayString) {
//       this.currentWeek.update((v) => v + 1);
//       localStorage.setItem('currentWeek', this.currentWeek.toString());

//       localStorage.setItem('lastWeekUpdate', todayString);
//       console.log('Semana actualizada correctamente a: ', this.currentWeek);
//     } else {
//       console.log('No toca actualizar esta semana o ya se hizo hoy');
//     }

//     console.log(`Valor de semana actual: ${this.currentWeek}`);

//     // Reset month
//     const lastmonthUpdate = localStorage.getItem('lastMonthUpdate');
//     console.log(`last month: ${lastmonthUpdate}`)

//     if (this.date.getDate() == 1 && lastmonthUpdate != todayString) {
//       this.totalWeek.forEach((element) => {
//         element.money.set(0);
//       });

//       this.currentWeek.set(0);
//       localStorage.setItem('currentWeek', '0');
//       localStorage.setItem('lastMonthUpdate',todayString)

//       // Reset Income
//       this.api.updateIncome({ cashIncome: 0, reset: true }).subscribe({
//         next: (data) => {
//           console.log(data);
//           localStorage.setItem('totalIncome', data.totalMoneyIncome);
//           this.totalMoneyIncome = data.totalMoneyIncome;
//         },
//         error: (err) => {
//           console.error(err);
//         },
//       });

//       // Reset history
//       this.api.deleteHistoryIncome().subscribe({
//         next: (data) => {
//           console.log(data);
//           this.updateIncome();
//         },
//         error: (err) => {
//           console.error(err);
//         },
//       });

//       this.currentWeek.set(0);

//       this.api.resetWeekUser({}).subscribe({
//         next: (data) => {
//           console.log(`Datos de la semana: `, data);

//           localStorage.setItem('week1', data.user.totalWeek1);
//           localStorage.setItem('week2', data.user.totalWeek2);
//           localStorage.setItem('week3', data.user.totalWeek3);
//           localStorage.setItem('week4', data.user.totalWeek4);
//           localStorage.setItem('week5', data.user.totalWeek5);
//         },
//         error: (err) => {
//           console.error(err);
//         },
//       });

//       localStorage.setItem('lastMonthUpdate', todayString);
//     } else {
//       console.log('ℹ️ No es día 1 o ya se reseteó el mes hoy');
//     }
//   }

//   saveIncome() {
//     if (!this.incomeForm.valid) return alert('Los campos deben estar llenos');

//     // Save dates in localStorage

//     this.totalWeek[this.currentWeek()].money.update(
//       (currentTotal) => currentTotal + parseFloat(this.incomeForm.value.cashIncome),
//     );

//     localStorage.setItem(
//       `week${this.currentWeek() + 1}`,
//       this.totalWeek[this.currentWeek()].money().toString(),
//     );

//     // save dates on server
//     console.log(this.incomeForm.value);
//     const cashIncomeObject = {
//       cashIncome: this.incomeForm.value.cashIncome,
//       week1: localStorage.getItem('week1'),
//       week2: localStorage.getItem('week2'),
//       week3: localStorage.getItem('week3'),
//       week4: localStorage.getItem('week4'),
//       week5: localStorage.getItem('week5'),
//     };

//     this.api.updateIncome(cashIncomeObject).subscribe({
//       next: (data) => {
//         console.log(`Data de actuzlizacion de usuario: ${data}`);
//         currentBalance.set(data.totalMoney);
//         this.totalMoneyIncome = data.totalMoneyIncome;

//         localStorage.setItem('totalMoney', data.totalMoney);
//         localStorage.setItem('totalIncome', data.totalMoneyIncome);
//         localStorage.setItem('week1', data.totalWeek1);
//         localStorage.setItem('week2', data.totalWeek2);
//         localStorage.setItem('week3', data.totalWeek3);
//         localStorage.setItem('week4', data.totalWeek4);
//         localStorage.setItem('week5', data.totalWeek5);
//       },
//       error: (err) => {
//         console.error(err);
//       },
//     });

//     // Update histories

//     const datesHistory: HistoryInterface = {
//       user_id: localStorage.getItem('user_id') || '',
//       nameMovement: this.incomeForm.value.nameIncome,
//       typeOperation: 'income',
//       money: this.incomeForm.value.cashIncome,
//     };

//     this.api.setHistory(datesHistory).subscribe({
//       next: (data) => {
//         console.log(data);
//         this.updateIncome();
//       },
//       error: (err) => {
//         console.error(err);
//       },
//     });

//     this.incomeDisplay = false;
//     this.incomeForm.reset();
//   }

//   test(date: Date) {
//     const dayOfMonth = date.getDate();
//     const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//     const startWeekday = firstDayOfMonth.getDay(); // 0 (Dom) a 6 (Sab)

//     // Ajuste para que la semana empiece en Lunes (si lo prefieres así)
//     // Si prefieres que empiece en Domingo, usa simplemente 'startWeekday'
//     const adjustedWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

//     return Math.ceil((dayOfMonth + adjustedWeekday) / 7);
//   }

//    updateIncome() {
//     this.api.getLastHistory().subscribe({
//       next: (data) => {
//         this.historyIncome = data;

//         if (this.historyIncome.length === 0) {
//           this.existIncome = false;
//           return;
//         }

//         this.existIncome = true;
//       },
//       error: (err) => {
//         console.error(err);
//       },
//     });
//   }