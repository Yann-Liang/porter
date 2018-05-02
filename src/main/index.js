import { nativeImage, app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { clearInterval } from 'timers';

clearCache(); //清理缓存。不然很坑爹

if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}
// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let mainWindow, tray = null, winURL = '',
	iconPath = '',
	iconPath1 = '',
	timer = null;

if (process.env.NODE_ENV === 'development') {
	winURL = `http://localhost:9080`;
	iconPath = path.join(__dirname, 'static/icon/bird.png');
	iconPath1 = path.join(__dirname, 'static/icon/white-bird.png');;
} else {
	winURL = `file://${__dirname}/index.html`;
	iconPath = path.join(app.getPath('exe'), '../static/icon/bird.png');
	iconPath1 = path.join(app.getPath('exe'), '../static/icon/white-bird.png');
}

function createWindow() {
	// 创建浏览器窗口。
	mainWindow = new BrowserWindow({
		width: 900,
		height: 350,
		minWidth: 900,
		minHeight: 350,
		useContentSize: true,
		frame: false, //是否创建有边框窗口
		resizable: false, //改变窗口size
		webPreferences: {
			webSecurity: false
		},
		show: false,//优雅地显示窗口
		transparent: true,
	});

	// 加载应用的 index.html
	mainWindow.loadURL(winURL);

	// 打开开发者工具。
	//mainWindow.webContents.openDevTools();

	// 当 window 被关闭，这个事件会被触发。
	mainWindow.on('closed', () => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		mainWindow = null
	});

	//所有东西都加载完成时，显示窗口并聚焦在上面提醒用户
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	tray = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate([
		{
			label: "打开面板",
			click() {
				mainWindow.show()
			}
		},
		{
			label: "退出",
			role: "quit"
		}
	]);

	tray.setToolTip('燕子客户端');//设置此托盘图标的悬停提示内容
	tray.setContextMenu(contextMenu);//设置此图标的上下文菜单
	tray.on('double-click', () => { //双击显示
		mainWindow.show();
	});

	//单点击 1.主窗口显示隐藏切换 2.清除闪烁
	tray.on("click", function () {
		clearInterval(timer);
		tray.setImage(iconPath);
		//主窗口显示隐藏切换
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});

	//注册开发者工具快捷键
	const retOpen = globalShortcut.register('CommandOrControl+F12', () => {
		BrowserWindow.getFocusedWindow().webContents.openDevTools({
			mode: 'undocked'
		});
	});

};

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		if (!mainWindow.isVisible()) {
			mainWindow.show();
		}
		mainWindow.focus();
	}
})

if (shouldQuit) {
	app.quit();
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// 在这文件，你可以续写应用剩下主进程代码。
	// 也可以拆分成几个文件，然后用 require 导入。
	if (mainWindow === null) {
		createWindow()
	}
});

//隐藏
ipcMain.on('hide-window', () => {
	mainWindow.hide();
});

//最小化
// ipcMain.on('minimize-window', () => {
// 	mainWindow.minimize();
// });

//最大化
// ipcMain.on('max-window', () => {
// 	if (mainWindow.isMaximized()) {
// 		mainWindow.maximize();
// 	} else {
// 		mainWindow.unmaximize();
// 	}
// });

//消息提示
ipcMain.on('news-tips', () => {
	//系统托盘图标闪烁
	let count = 0;
	clearInterval(timer);
	timer = setInterval(() => {
		count++;
		if (count % 2 == 0) {
			tray.setImage(iconPath)
		} else {
			tray.setImage(iconPath1)
		}
	}, 600);
});

function clearCache() {
	let path = app.getPath('appData') + '/Electron/Cache',
		files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			fs.unlinkSync(path + "/" + file);
		});
	}
};