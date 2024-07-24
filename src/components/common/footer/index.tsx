import { ReactNode } from "react";

const FooterComponent = (): ReactNode => {
  return (
    <>
      <section className="bg-blue-400 mt-10 overflow-hidden">
        <div className="max-w-full px-4 py-12 mx-auto space-y-8 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center -mx-5 -my-2">
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                Team
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-800 hover:text-white">
                Terms
              </a>
            </div>
          </nav>
          <div className="flex justify-center mt-8 space-x-6">
            <a href="#" className="text-gray-800 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.238 4.128 9.55 9.336 9.95v-7.04H7.691v-2.91h3.645v-2.25c0-3.607 1.832-5.643 4.527-5.643 1.317 0 2.721.238 2.721.238v2.99h-1.531c-1.509 0-1.978.937-1.978 1.911v2.307h3.48l-.557 2.91h-2.923v7.042C17.872 21.548 22 17.237 22 12z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-800 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M23 3a10.918 10.918 0 01-3.142.863A4.458 4.458 0 0022.4 2a9.48 9.48 0 01-3.016 1.152A4.492 4.492 0 0016.687 2a4.483 4.483 0 00-4.482 4.482c0 .35.037.688.107 1.015A12.744 12.744 0 012.877 2.879a4.448 4.448 0 001.392 5.974A4.473 4.473 0 01.964 8.72v.058a4.48 4.48 0 003.583 4.395A4.501 4.501 0 013 12.114a4.463 4.463 0 001.14.153 4.497 4.497 0 004.206-3.115A8.979 8.979 0 0016.566 12a8.965 8.965 0 008.482-8.815A9.087 9.087 0 0023 3z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-800 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2.5c1.54 0 1.732.006 2.34.033.617.028 1.057.118 1.49.247.391.124.747.292 1.071.515.316.22.6.487.84.84.229.324.392.68.515 1.072.13.432.22.872.248 1.489.028.607.034.8.034 2.34s-.006 1.733-.034 2.34c-.028.617-.118 1.057-.247 1.49-.124.391-.292.747-.515 1.071-.22.316-.487.6-.84.84-.324.229-.68.392-1.072.515-.432.13-.872.22-1.49.247-.607.028-.8.034-2.34.034s-1.733-.006-2.34-.034c-.617-.028-1.057-.118-1.49-.247-.391-.124-.747-.292-1.071-.515-.316-.22-.6-.487-.84-.84-.229-.324-.392-.68-.515-1.072-.13-.432-.22-.872-.248-1.489-.028-.607-.034-.8-.034-2.34s.006-1.733.034-2.34c.028-.617.118-1.057.247-1.49.124-.391.292-.747.515-1.071.22-.316.487-.6.84-.84.324-.229.68-.392 1.072-.515.432-.13.872-.22 1.49-.248.607-.028.8-.034 2.34-.034zM12 0c-1.66 0-1.866.007-2.52.037-1.016.041-1.947.108-2.878.214-1.162.135-2.236.328-3.279.565a7.46 7.46 0 00-2.593 1.036C.349 2.45.22 2.797.15 3.213.074 3.721 0 4.22 0 5.042v14.904c0 .822.074 1.321.15 1.829.07.417.199.764.442 1.09a7.46 7.46 0 002.593 1.036c1.043.237 2.117.43 3.279.565.931.106 1.862.173 2.878.214 1.661.03 1.867.037 2.52.037 1.719 0 2.967-.308 4.022-.715a7.386 7.386 0 003.526-2.058 7.386 7.386 0 002.058-3.526c.407-1.055.715-2.303.715-4.022 0-1.719-.308-2.967-.715-4.022a7.386 7.386 0 00-2.058-3.526 7.386 7.386 0 00-3.526-2.058C14.967.308 13.719 0 12 0z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
          <p className="text-center text-base leading-6 text-gray-800">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
};

export default FooterComponent;
