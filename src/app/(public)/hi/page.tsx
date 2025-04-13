'use client';

import Link from 'next/link';
import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { ArrowRight, Menu, Rocket, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Logo } from '~/components/shared/logo';
import { DialogLogin } from '~/components/shared/dialog-login';
import { DialogRegister } from '~/components/shared/dialog-register';
import { authClient } from '~/server/auth/client';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const menuItems = [
  {
    name: 'Features',
    href: '/features',
  },
  {
    name: 'Solution',
    href: '/solution',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'About',
    href: '/about',
  },
];

export default function Hi() {
  const { data: session } = authClient.useSession();
  const [menuState, setMenuState] = React.useState(false);
  const [isOpenLogin, setIsOpenLogin] = React.useState(false);
  const [isOpenRegister, setIsOpenRegister] = React.useState(false);

  return (
    <>
      <header className='absolute top-0 right-0 left-0'>
        <nav
          data-state={menuState && 'active'}
          className='fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent'
        >
          <div className='m-auto max-w-5xl px-6'>
            <div className='flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4'>
              <div className='flex w-full justify-between lg:w-auto'>
                <Link
                  href='/'
                  aria-label='home'
                  className='flex items-center space-x-2'
                >
                  <Logo />
                  <span className='font-bold text-xl'>DevTrack</span>
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                  className='relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden'
                >
                  <Menu className='in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200' />
                  <X className='in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200' />
                </button>
              </div>

              <div className='bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent'>
                <div className='lg:pr-4'>
                  <ul className='space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm'>
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className='text-muted-foreground hover:text-accent-foreground block duration-150'
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6'>
                  <Button
                    className='cursor-pointer'
                    onClick={() => setIsOpenLogin(true)}
                    asChild
                    variant='outline'
                    size='sm'
                  >
                    <span>Login</span>
                  </Button>
                  <Button
                    className='cursor-pointer'
                    onClick={() => setIsOpenRegister(true)}
                    asChild
                    size='sm'
                  >
                    <span>Register</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className='overflow-hidden max-h-screen'>
        <section className='relative'>
          <div className='relative py-24 lg:py-28'>
            <div className='mx-auto max-w-7xl px-6 md:px-12'>
              <div className='text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5'>
                <Link
                  href='/'
                  className='rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3'
                >
                  <span className='bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs'>
                    New
                  </span>
                  <span className='text-sm'>Introduction DevTrack.io</span>
                  <span className='bg-(--color-border) block h-4 w-px'></span>

                  <ArrowRight className='size-4' />
                </Link>

                <h1 className='mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]'>
                  Tame the Wild West <br /> of Software Development
                </h1>
                <p className='mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block'>
                  An internal platform, highly powerful software to track your
                  project development process and your team's productivity.
                </p>
                <p className='mx-auto mt-6 max-w-2xl text-wrap sm:hidden'>
                  An internal platform, highly powerful software to track your
                  project development process.
                </p>

                <div className='mt-8'>
                  <Button size='lg' asChild>
                    <Link href='#'>
                      <Rocket className='relative size-4' />
                      <span className='text-nowrap'>Start Building</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className='x-auto relative mx-auto mt-8 max-w-lg sm:mt-12'>
                <div className='absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10'></div>
                <div className='absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl dark:bg-white/20'></div>

                <Swiper
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  loop
                  autoplay={{ delay: 5000 }}
                  modules={[Autoplay, EffectCoverflow]}
                >
                  <SwiperSlide className='px-2'>
                    <div className='bg-background rounded-(--radius) h-44 max-w-lg border p-9'>
                      <div className='mx-auto h-fit w-full'>
                        <NetlifyLogo />
                      </div>
                      <p className='mt-6 text-center text-lg font-medium'>
                        30% Increase in revenue
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className='px-2'>
                    <div className='bg-background rounded-(--radius) h-44 max-w-lg border p-9'>
                      <div className='mx-auto h-fit w-full'>
                        <AstroLogo />
                      </div>
                      <p className='mt-6 text-center text-lg font-medium'>
                        45% Increase in revenue
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className='px-2'>
                    <div className='bg-background rounded-(--radius) h-44 max-w-lg border p-9'>
                      <div className='mx-auto h-fit w-full'>
                        <WorkOsLogo />
                      </div>
                      <p className='mt-6 text-center text-lg font-medium'>
                        60% Increase in revenue
                      </p>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      </main>
      <DialogLogin open={isOpenLogin} onOpenChange={setIsOpenLogin} />
      <DialogRegister open={isOpenRegister} onOpenChange={setIsOpenRegister} />
    </>
  );
}

const WorkOsLogo = () => {
  return (
    <svg
      className='m-auto h-8'
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      id='Layer_1'
      x='0px'
      y='0px'
      viewBox='0 0 251.8 48'
    >
      <g>
        <path
          fill='currentColor'
          className='text-[#29363D] dark:text-white'
          d='M73,7.2h7l5,20.6c0.9,3.9,1.1,6.2,1.1,6.2h0.1c0,0,0.3-2.3,1.3-6.2l4.8-20.6h7.9l5.1,20.6   c1,4,1.2,6.2,1.2,6.2h0.1c0,0,0.1-2.2,1-6.2l4.8-20.6h7l-8.8,33.9h-7.7l-5.3-20.5c-1.1-4.5-1.2-6.4-1.2-6.4h-0.1c0,0-0.1,2-1.1,6.4   l-5,20.5h-8C82,41.1,73,7.2,73,7.2z M118.2,28.8c0-7.7,5-12.8,12.6-12.8c7.5,0,12.5,5,12.5,12.8c0,7.8-5,12.8-12.5,12.8   C123.2,41.6,118.2,36.6,118.2,28.8L118.2,28.8z M136.8,28.8c0-5-2.4-7.8-6-7.8c-3.9,0-6.1,3.2-6.1,7.8c0,5.1,2.4,7.9,6.1,7.9   C134.6,36.7,136.8,33.6,136.8,28.8L136.8,28.8z M146.4,16.4h6.2V21h0.1c1.1-2.4,3.6-4.7,8-4.7c0.7,0,1.2,0.1,1.5,0.2v6.2H162   c0,0-0.6-0.2-2.1-0.2c-4.8,0-7.4,2.8-7.4,8.1v10.6h-6.2V16.4z M165.1,7.2h6.2v10.9c0,6.4-0.1,7.6-0.1,7.6h0.1l9.2-9.2h7.7   l-10.8,10.7l12.5,14h-7.3l-9-10.2l-2.3,2.3v7.9H165L165.1,7.2L165.1,7.2z M189.9,24.3c0-10.4,6.5-17.4,16.2-17.4s16.2,7,16.2,17.4   s-6.5,17.4-16.2,17.4C196.4,41.7,189.9,34.7,189.9,24.3z M215.7,24.3c0-7.1-3.8-11.9-9.5-11.9c-5.7,0-9.5,4.8-9.5,11.9   s3.8,11.9,9.5,11.9C211.8,36.2,215.7,31.4,215.7,24.3z M224.7,29.8h7.1c0,4,2.7,6.2,6.9,6.2c3.5,0,5.9-1.8,5.9-4.3   c0-2.8-1.9-3.6-7.7-4.7c-5.4-1.1-11.1-2.9-11.1-9.9c0-5.9,5-10.3,12.7-10.3c8,0,12.9,4.2,12.9,10.5h-7.1c0-3.1-2.4-5-5.8-5   c-3.5,0-5.7,1.7-5.7,4.2c0,2.6,1.5,3.7,6.3,4.6c7,1.5,12.8,2.3,12.8,10.1c0,6.2-5.4,10.3-13.3,10.3   C230.4,41.5,224.7,36.9,224.7,29.8z'
        ></path>
        <path
          fill='#6363F1'
          d='M0,24c0,1.1,0.3,2.1,0.8,3l9.7,16.8c1,1.7,2.5,3.1,4.4,3.7c3.6,1.2,7.5-0.3,9.4-3.5l2.3-4.1   l-9.2-16l9.8-16.9L29.5,3c0.7-1.2,1.6-2.2,2.7-3H17.2c-2.6,0-5.1,1.4-6.4,3.7L0.8,21C0.3,21.9,0,22.9,0,24z'
        ></path>
        <path
          fill='#6363F1'
          d='M55.4,24c0-1.1-0.3-2.1-0.8-3l-9.8-17c-1.9-3.3-5.8-4.7-9.4-3.5c-1.9,0.6-3.4,2-4.4,3.7   L28.7,8L38,24l-9.8,16.9L25.9,45c-0.7,1.2-1.6,2.2-2.7,3h15.1c2.6,0,5.1-1.4,6.4-3.7l10-17.3C55.1,26.1,55.4,25.1,55.4,24z'
        ></path>
      </g>
    </svg>
  );
};

const AstroLogo = () => {
  return (
    <svg
      className='mx-auto h-12'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 460 160'
      fill='none'
    >
      <path
        d='M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z'
        fill='currentColor'
      />
      <path
        d='M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z'
        fill='url(#paint0_linear_1_33)'
      />
      <path
        d='M40 101.034C40 101.034 53.3775 94.5177 66.7924 94.5177L76.9068 63.2155C77.2855 61.7017 78.3911 60.6729 79.6393 60.6729C80.8875 60.6729 81.9932 61.7017 82.3719 63.2155L92.4862 94.5177C108.374 94.5177 119.279 101.034 119.279 101.034C119.279 101.034 96.5558 39.133 96.5114 39.0088C95.8592 37.1787 94.7583 36 93.274 36H66.007C64.5227 36 63.4662 37.1787 62.7696 39.0088C62.7205 39.1307 40 101.034 40 101.034Z'
        fill='currentColor'
      />
      <path
        d='M181.043 81.1227C181.043 86.6079 174.22 89.8838 164.773 89.8838C158.624 89.8838 156.45 88.3601 156.45 85.1604C156.45 81.8083 159.149 80.2085 165.297 80.2085C170.846 80.2085 175.569 80.2846 181.043 80.9703V81.1227ZM181.118 74.3423C177.744 73.5805 172.645 73.1234 166.572 73.1234C148.877 73.1234 140.555 77.3135 140.555 87.065C140.555 97.1975 146.253 101.083 159.449 101.083C170.621 101.083 178.193 98.2641 180.968 91.3313H181.417C181.342 93.0074 181.268 94.6834 181.268 95.9785C181.268 99.5592 181.867 99.8639 184.791 99.8639H198.587C197.837 97.7308 197.388 91.7122 197.388 86.5317C197.388 80.9703 197.612 76.7802 197.612 71.1426C197.612 59.6388 190.715 52.3251 169.121 52.3251C159.824 52.3251 149.477 53.925 141.605 56.2867C142.354 59.4102 143.404 65.7335 143.929 69.8474C150.752 66.6477 160.424 65.2764 167.922 65.2764C178.268 65.2764 181.118 67.6381 181.118 72.4377V74.3423Z'
        fill='currentColor'
      />
      <path
        d='M218.971 84.3224C217.097 84.5509 214.547 84.5509 211.923 84.5509C209.149 84.5509 206.6 84.4748 204.875 84.2462C204.875 84.8557 204.8 85.5413 204.8 86.1508C204.8 95.6738 211.024 101.235 232.917 101.235C253.535 101.235 260.208 95.75 260.208 86.0746C260.208 76.9325 255.785 72.4377 236.216 71.4473C220.995 70.7616 219.646 69.0856 219.646 67.181C219.646 64.9717 221.595 63.8289 231.792 63.8289C242.364 63.8289 245.213 65.2764 245.213 68.3238V69.0094C246.713 68.9332 249.412 68.8571 252.186 68.8571C254.81 68.8571 257.659 68.9332 259.309 69.0856C259.309 68.3999 259.384 67.7905 259.384 67.2572C259.384 56.0581 250.086 52.4013 232.092 52.4013C211.848 52.4013 205.025 57.3533 205.025 67.0286C205.025 75.7136 210.499 81.1227 229.918 81.9607C244.238 82.4178 245.813 84.0177 245.813 86.227C245.813 88.5887 243.489 89.6553 233.442 89.6553C221.895 89.6553 218.971 88.0554 218.971 84.7795V84.3224Z'
        fill='currentColor'
      />
      <path
        d='M284.955 44.1734C279.482 49.2778 269.66 54.3821 264.187 55.7534C264.262 58.5722 264.262 63.7527 264.262 66.5715L269.285 66.6477C269.21 72.0568 269.135 78.6086 269.135 82.9511C269.135 93.0835 274.458 100.702 291.028 100.702C298.001 100.702 302.65 99.9401 308.423 98.7212C307.823 94.9881 307.148 89.2743 306.923 84.9319C303.475 86.0746 299.126 86.6841 294.327 86.6841C287.654 86.6841 284.955 84.8557 284.955 79.599C284.955 75.028 284.955 70.7616 285.03 66.8001C293.578 66.8763 302.125 67.0286 307.148 67.181C307.073 63.2194 307.223 57.5056 307.448 53.6964C300.176 53.8488 292.003 53.925 285.255 53.925C285.33 50.5729 285.405 47.3732 285.48 44.1734H284.955Z'
        fill='currentColor'
      />
      <path
        d='M329.736 64.286C329.811 60.3244 329.886 56.9724 329.961 53.6964H314.89C315.115 60.2483 315.115 66.9525 315.115 76.7802C315.115 86.6079 315.04 93.3883 314.89 99.8639H332.135C331.835 95.2929 331.76 87.5983 331.76 81.0465C331.76 70.6855 335.959 67.7143 345.481 67.7143C349.905 67.7143 353.054 68.2476 355.828 69.238C355.903 65.3526 356.653 57.8104 357.102 54.4583C354.253 53.6203 351.104 53.087 347.28 53.087C339.108 53.0108 333.11 56.3629 330.336 64.3622L329.736 64.286Z'
        fill='currentColor'
      />
      <path
        d='M404.808 76.4754C404.808 84.7795 398.81 88.6649 389.363 88.6649C379.991 88.6649 373.993 85.008 373.993 76.4754C373.993 67.9428 380.066 64.7431 389.363 64.7431C398.735 64.7431 404.808 68.1714 404.808 76.4754ZM420.478 76.0945C420.478 59.5626 407.582 52.1728 389.363 52.1728C371.069 52.1728 358.623 59.5626 358.623 76.0945C358.623 92.5503 370.244 101.388 389.288 101.388C408.482 101.388 420.478 92.5503 420.478 76.0945Z'
        fill='currentColor'
      />
      <defs>
        <linearGradient
          id='paint0_linear_1_33'
          x1='61.0003'
          y1='136'
          x2='104.622'
          y2='115.39'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#D83333' />
          <stop offset='1' stopColor='#F041FF' />
        </linearGradient>
      </defs>
    </svg>
  );
};

const NetlifyLogo = () => {
  return (
    <>
      <svg
        className='mx-auto h-12 dark:hidden'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 209'
        fill='none'
      >
        <g clipPath='url(#clip0_235_8)'>
          <path
            d='M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z'
            fill='#05BDBA'
          />
          <path
            d='M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z'
            fill='#05BDBA'
          />
          <path
            d='M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z'
            fill='#05BDBA'
          />
          <path
            d='M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z'
            fill='#05BDBA'
          />
          <path
            d='M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z'
            fill='#05BDBA'
          />
          <path
            d='M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z'
            fill='#05BDBA'
          />
          <path
            d='M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z'
            fill='#014847'
          />
          <path
            d='M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z'
            fill='#014847'
          />
          <path
            d='M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z'
            fill='#014847'
          />
          <path
            d='M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z'
            fill='#014847'
          />
          <path
            d='M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z'
            fill='#014847'
          />
          <path
            d='M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z'
            fill='#014847'
          />
          <path
            d='M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z'
            fill='#014847'
          />
        </g>
        <defs>
          <clipPath id='clip0_235_8'>
            <rect width='512' height='208.126' fill='white' />
          </clipPath>
        </defs>
      </svg>
      <svg
        className='mx-auto hidden h-12 dark:block'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 209'
        fill='none'
      >
        <g clipPath='url(#clip0_235_26)'>
          <path
            d='M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z'
            fill='#32E6E2'
          />
          <path
            d='M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z'
            fill='#32E6E2'
          />
          <path
            d='M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z'
            fill='#32E6E2'
          />
          <path
            d='M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z'
            fill='#32E6E2'
          />
          <path
            d='M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z'
            fill='#32E6E2'
          />
          <path
            d='M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z'
            fill='#32E6E2'
          />
          <path
            d='M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z'
            fill='white'
          />
          <path
            d='M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z'
            fill='white'
          />
          <path
            d='M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z'
            fill='white'
          />
          <path
            d='M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z'
            fill='white'
          />
          <path
            d='M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z'
            fill='white'
          />
          <path
            d='M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z'
            fill='white'
          />
          <path
            d='M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z'
            fill='white'
          />
        </g>
        <defs>
          <clipPath id='clip0_235_26'>
            <rect width='512' height='208.126' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};
