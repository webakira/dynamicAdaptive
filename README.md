# Хлебные крошки в виде слайдера #

Динамическое перемещение элементов DOM, в зависимости от размера экрана.

## Как использовать ##

1. Инициализируем JS
2. Добавляем к элементу аттрибут data-da (<div data-da="">) и перечесляем параметры через запятую.
	* __Класс__, в который булет перемещен элемент (пример: main-menu)
	* __Позиция в DOM__, куда встанет переносимый элемент (пример: 3)
	* __Размер экрана__, когда сработает перенос элемента (пример: 768)
	* Перенос элемента сработает, когда __размер экрана__ будет __больше__ или __меньше__ выбранного значения (max или min)

## Пример ##

```html

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Динамический адаптив</title>
</head>

<body>
	<div class="element-1" data-da="element-2,1,992,max">
		<p>Когда размер экрана будет меньше или равен 992, то этот div переместится внутрь div.element-2</p>
	</div>
	<div class="element-2">
		<p>Это элемент 2</p>
	</div>
</body>

</html>

```


[Смотреть видео](https://www.youtube.com/watch?v=QKuMr575vlQ)

[Смотреть демо](https://www.youtube.com/watch?v=QKuMr575vlQ)