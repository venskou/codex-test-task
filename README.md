☁ Hosted on Heroku
:zap:&nbsp;<a href="https://venskou-codex-test.herokuapp.com/" align="center">Live demo</a><br>
<small>Подождите пока проект запустится на сервере</small>

Задача - написать простую программу для рисования, исполняющую последовательность команд для рисования и заливки фигур используя слудующие команды:

`C w h`<br>
`L x1 y1 x2 y2`<br>
`R x1 y1 x2 y2`<br>
`B x y c`<br>

<b>Canvas​:</b> создать canvas шириной w и высотой h.<br>
<b>Line​:</b>  проложить  линию  от  (x1,y1)  до  (x2,y2),  используя  для  рисования псевдографический 
символ “x”. Поддерживаются только горизонтальные и вертикальные линии.<br>
<b>Rectangle​:</b>  создать  прямоугольник  с  верхним  левым  углом  в  точке  (x1,y1),  нижним  правым 
углом  в  точке  (x2,y2).  Вертикальные  и  горизонтальные  линии  должны  быть  отрисованы 
псевдографическими символами “x”.<br>
<b>Bucket  Fill​:</b>  залить  всю  область  (x,y)  цветом  ("colour",  c),  аналогично  тому,  как  работает 
инструмент “Заливка” в графических редакторах.<br>
<b>Важно:</b> рисовать можно только при условии, что создан canvas! 

Пример:<br>
`C 20 4`<br>
`L 1 2 6 2`<br>
`L 6 3 6 4`<br>
`R 16 1 20 3`<br>
`B 10 3 n`<br>

Результат:
<pre>
______________________
|                    |
|                    |
|                    |
|                    |
______________________

______________________
|                    |
|xxxxxx              |
|                    |
|                    |
______________________

______________________
|                    |
|xxxxxx              |
|     x              |
|     x              |
______________________

______________________
|               xxxxx|
|xxxxxx         x   x|
|     x         xxxxx|
|     x              |
______________________

______________________
|oooooooooooooooxxxxx|
|xxxxxxooooooooox   x|
|     xoooooooooxxxxx|
|     xoooooooooooooo|
______________________
</pre>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
