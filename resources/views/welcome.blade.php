<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] flex p-6 lg:p-8 items-center lg:justify-center min-h-screen flex-col">
Welcome

<a href="/shelf" class="underline flex items-center justify-center space-x-0.5"><span>Shelf</span>
    <svg
        width="10"
        height="11"
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 mt-1"
    >
        <path
            d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
            stroke="currentColor"
            stroke-linecap="square"
        />
    </svg>
</a>

</body>
</html>
