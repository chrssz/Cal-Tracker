# Cal Tracker

A progressive web app for tracking daily calorie and macro intake. Installable on mobile devices without an app store.

---
## Features

- **Calorie & Macro Tracking** — set daily goals for calories, fats, carbs, and protein with live progress bars that update as you log meals
- **Meal Logging** — create named meals and add food items manually or from your personal food library
- **Food Library** — save custom foods with macro data; hold to select a saved food and choose a serving size before adding it to a meal
- **Meal History** — view a log of all meals consumed today with a breakdown of each food item and total macros per meal; remove any meal from history
- **Settings** — update daily calorie and macro goals at any time
- **PWA** — installable on iOS and Android directly from the browser, no app store required
---
## Tech Stack

**Frontend**
- Vanilla JavaScript (ES6 modules)
- HTML5 / CSS3
- Vite (build tool + PWA support)

**Backend** *(in development)*
- Node.js
- Express.js
- MongoDB (native driver)

**Auth** *(in development)*
- Session-based authentication
- HTTP-only cookies
- SHA-256 password hashing via Node.js `crypto`
****

## Running Locally

### Frontend
```bash
cd cal-tracker
npm install
npm run dev
```
Open `http://localhost:5173`
---
## ScreenShots

<p>Web App's main page</p>
<img width="391" height="844" alt="DefaultApp" src="https://github.com/user-attachments/assets/8d95d5c6-4e6f-4954-bb47-8c6d022f8f91" />


<p>Settings for changing calorie goals</p>
<img width="391" height="844" alt="CalorieGoalSettings" src="https://github.com/user-attachments/assets/d9deae3e-070d-4be6-b70b-14e45cb65849" />


<p>Adding a meal. Options to name a meal. Insert a one time custom food</p>
<img width="391" height="844" alt="SingleFoodItemInsert" src="https://github.com/user-attachments/assets/a7da1d29-c406-4f7a-9d7f-52dcf402fd84" />


<p>One time custom food item added, added foods will have a blue panel.</p>
<img width="391" height="844" alt="SingelFoodItemInserted" src="https://github.com/user-attachments/assets/06c3e8bc-515a-4569-9a8e-f997a360b956" />


<p>Save your commonly used foods in the food library!</p>
<img width="391" height="844" alt="FoodLibraryShowCase" src="https://github.com/user-attachments/assets/8b60aa31-7be4-4662-8741-82cd201a13bd" />


<p>Adding a new food entry into the library</p>
<img width="391" height="844" alt="FoodLibraryFormFill" src="https://github.com/user-attachments/assets/2866622c-96da-43af-8099-48a51474223b" />


<p>Added your new entry into the library</p>
<img width="391" height="844" alt="FoodLibraryFormAdded" src="https://github.com/user-attachments/assets/93928155-067f-470d-a73b-11a9d6ddfbcb" />


<p>Hold to select a food item to add to the current meal</p>
<img width="391" height="844" alt="Hold Food Item to Add To meal" src="https://github.com/user-attachments/assets/b0f09eb6-af37-4f3a-9971-123927173991" />


<p>Serving size choices! For precise measurers select serving size in grams</p>
<img width="391" height="844" alt="Serving  Size Choices" src="https://github.com/user-attachments/assets/0d1ccb28-f4e5-447d-b58b-7f759d8da462" />

<p>Selected food added to the meal in </p>
<img width="391" height="844" alt="NewFoodAddedToFoods" src="https://github.com/user-attachments/assets/3f1dd186-6adb-4ef6-89f9-1ca5c9e16b95" />

<p>Saved meal, with history overview of today's consumed meal</p>
<img width="391" height="844" alt="SavedLunchWithHistoryShowcase" src="https://github.com/user-attachments/assets/6730868c-1b90-4188-bdb5-f26859e3c147" />
