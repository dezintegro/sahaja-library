import Link from 'next/link'

export default function Page() {
    return <div className='min-h-screen w-full flex flex-col justify-center items-center'>
        <h1>404 | Такой страницы не существует </h1>
        <div>
            <Link className='text-blue-600' href="/">На главную</Link>
        </div>
    </div>
}
