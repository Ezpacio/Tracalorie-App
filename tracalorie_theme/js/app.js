// OOP Proje Ornekleri
/*
1 - To-Do Uygulaması:

- Bir To-Do uygulaması oluşturun.
- Görevler için bir Görev sınıfı oluşturun.
- Her görevin başlık, açıklama, tamamlanma durumu gibi özellikleri olsun.
- Görevleri ekleyebilme, silme, güncelleme ve tamamlama gibi işlemleri gerçekleştirebilen bir uygulama yapın.

2 - Müşteri Yönetim Sistemi:

- Bir müşteri yönetim sistemi oluşturun.
- Müşteri sınıfı oluşturun ve her müşterinin adı, soyadı, e-posta adresi gibi özellikleri olsun.
- Yeni müşteri ekleyebilme, müşteri bilgilerini güncelleme, müşteri silme gibi işlemleri gerçekleştirebilen bir sistem yapın.

3 - Online Alışveriş Sepeti:

- Bir online alışveriş sepeti uygulaması oluşturun.
- Ürün sınıfı oluşturun ve her ürünün adı, fiyatı gibi özellikleri olsun.
- Sepet sınıfı oluşturun ve ürünleri sepete ekleyebilme, sepetten çıkartabilme gibi işlemleri gerçekleştirebilen bir uygulama yapın.

4 - Hesap Makinesi:

- Basit bir hesap makinesi uygulaması oluşturun.
- Matematik işlemleri için bir HesapMakinesi sınıfı oluşturun.
- Toplama, çıkarma, çarpma, bölme gibi işlemleri gerçekleştirebilen bir hesap makinesi yapın.

5 - Not Defteri Uygulaması:

- Bir not defteri uygulaması oluşturun.
- Not sınıfı oluşturun ve her notun başlık, içerik gibi özellikleri olsun.
- Yeni not ekleyebilme, notları güncelleme, notları silme gibi işlemleri gerçekleştirebilen bir uygulama yapın.
*/

/*
OOP PRENSİPLERİ ==>

Tek Sorumluluk Prensibi (Single Responsibility Principle - SRP): Bir sınıfın sadece bir sorumluluğu olmalıdır.

Açık/Kapalı Prensibi (Open/Closed Principle - OCP): Bir sınıf, genişletilebilir olmalı ancak değiştirilemez olmalıdır.

Liskov Yerine Koyma Prensibi (Liskov Substitution Principle - LSP): Alt sınıflar, üst sınıfların yerine geçebilmelidir.

Arayüz Ayırma Prensibi (Interface Segregation Principle - ISP): Bir sınıf, kullanmadığı metotları içermemelidir.

Bağımlılıkların Tersine Çevrilmesi Prensibi (Dependency Inversion Principle - DIP): Yüksek seviyeli modüller, düşük seviyeli modüllere bağlı olmamalıdır.
*/
function generateUniqueId() {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString(16);
}

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalStorage(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesLimit();
        this._displayTotalCalories();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    // Public methods/API //

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);

        this._render()
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);

        this._render()
    }

    removeMeal(id) {
        const index = this._meals.findIndex(meal => meal.id === id);

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1)
            Storage.removeMeal(id);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex(workout => workout.id === id);

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1)
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.removeAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout))
    }

    // Private Methods//

    _displayTotalCalories() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const limitCaloriesEl = document.getElementById('calories-limit');
        limitCaloriesEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const calorieConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);

        calorieConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const calorieBurnedEl = document.getElementById('calories-burned');

        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        calorieBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const calorieRemainingEl = document.getElementById('calories-remaining');

        const remaining = this._calorieLimit - this._totalCalories;

        calorieRemainingEl.innerHTML = remaining;

        const cardElement = calorieRemainingEl.parentElement.parentElement;
        if (remaining <= 0) {
            cardElement.classList.remove('bg-light');
            cardElement.classList.add('bg-danger', 'text-white');
        } else {
            cardElement.classList.remove('bg-danger', 'text-white');
            cardElement.classList.add('bg-light');
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');

        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100)
        if (this._totalCalories <= 0) {
            progressEl.style.width = '0%';
        } else {
            progressEl.style.width = `${width}%`;
        }

        width === 100
            ? progressEl.classList.add('bg-danger')
            : progressEl.classList.remove('bg-danger');
    }

    _displayItem(item, type) {
        const itemsEl = document.getElementById(`${type}-items`);
        const itemEl = document.createElement('div');

        itemEl.classList.add('card', 'my-2');
        itemEl.setAttribute('data-id', item.id);

        itemEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1 title">${item.name}</h4>
                    <div class="fs-1 bg-${type !== 'meal' ? 'secondary' : 'primary'} text-white text-center rounded-2 px-2 px-sm-5">
                        ${item.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
        itemsEl.appendChild(itemEl);
    }

    _displayNewMeal(meal) {
        this._displayItem(meal, 'meal');
    }

    _displayNewWorkout(workout) {
        this._displayItem(workout, 'workout');
    }

    _render() {
        this._displayTotalCalories();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = generateUniqueId();
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = generateUniqueId();
        this.name = name;
        this.calories = calories;
    }
}

class Storage {
    // Calorie Limit from Storage
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit')
        }
        return calorieLimit;
    }

    static setCalorieLimit(caloireLimit) {
        localStorage.setItem('calorieLimit', caloireLimit)
    }

    // Calorie Total from Storage
    static getTotalStorage(defaultCalorie = 0) {
        let totalCalorie;
        if (localStorage.getItem('totalCalorie') === null) {
            totalCalorie = defaultCalorie;
        } else {
            totalCalorie = +localStorage.getItem('totalCalorie')
        }
        return totalCalorie;
    }

    static updateTotalCalories(totalCalorie) {
        localStorage.setItem('totalCalorie', totalCalorie)
    }

    // Meals from Storage
    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            };
        });
        localStorage.setItem('meals', JSON.stringify(meals));
    };


    // Workouts from Storage
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            };
        });
        localStorage.setItem('workouts', JSON.stringify(workouts));
    };

    // Remove all item from storage
    static removeAll() {
        localStorage.clear();
    }

};





class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._addEvetListeners();
        this._tracker.loadItems();
        this.count = 0;
    }

    _addEvetListeners() {
        document.getElementById('meal-form')
            .addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form')
            .addEventListener('submit', this._newItem.bind(this, 'workout'));
        document.getElementById('meal-items')
            .addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items')
            .addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals')
            .addEventListener('keyup', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts')
            .addEventListener('keyup', this._filterItems.bind(this, 'workout'));
        document.getElementById('reset')
            .addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form')
            .addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        if (name.value === '' || calories.value === '') {
            alert('Please fill in the blanks!');
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);

        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);

        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true
        });
    }

    _removeItem(type, e) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal'
                    ? this._tracker.removeMeal(id)
                    : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        const itemsContainer = document.getElementById(`${type}-items`);
        const cards = Array.from(itemsContainer.querySelectorAll('.card'));

        cards.forEach(card => {
            const name = card.querySelector('.title').textContent.toLowerCase();

            name.indexOf(text) !== -1 ? card.style.display = 'block' : card.style.display = 'none';
        });
    
        cards.sort((a, b) => {
            const nameA = a.querySelector('.title').textContent.toLowerCase();
            const nameB = b.querySelector('.title').textContent.toLowerCase();

            if(text !== ''){
                return nameA.startsWith(text) ? -1 : nameB.startsWith(text) ? 1 : 0;
            }
            
        });
    
        cards.forEach(card => itemsContainer.appendChild(card));
    }

    _reset() {
        this._tracker.reset();

        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';

    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.getElementById('limit');
        const errorDiv = document.querySelector('.alert-danger');

        if (errorDiv) return;

        function showError(message) {
            if (this.count <= 2) {
                const limitForm = document.getElementById('limit-form');
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('alert', 'alert-danger', 'mb-0', 'mt-3', 'pb-2', 'pt-2');
                errorDiv.textContent = message;

                limitForm.appendChild(errorDiv);
                setTimeout(() => limitForm.removeChild(errorDiv), 2000);
                this.count++;
            }
        }

        const errorMessage = limit.value.trim() === '' ? 'Please fill in the blanks!' : isNaN(limit.value) ? 'Please enter only numbers.' : null;
        if (errorMessage) {
            showError.call(this, errorMessage);
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modal = bootstrap.Modal.getInstance(document.getElementById('limit-modal'));
        modal.hide();
    }

};

const app = new App();
