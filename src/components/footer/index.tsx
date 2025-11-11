import "./index.css";
import Image from "next/image";
export default function Footer() {
  return (
    <div className="footer bg-black " >
      <div className="footer-first">
        <div className="flex">
          {/* 第一部分 */}
          <div className="flex flex-col footer-mark">
            <Image src="/section1/seeme.svg" alt="logo" width={157} height={29.897} />
            <div className="text-white text-[17px] leading-[17px] mt-[14.7px]">To see and to be seen</div>
          </div>

          {/* 第二部分 */}
          <div className="footer-mid">
            <div className="text-white text-[16px] leading-[24px]">Be the first to know</div>
            <div className="text-[#999] text-[14px] leading-[14px] mt-[8px]">We’ll send you only what matters — no noise, no spam.</div>
            <div className="mt-[36px] flex items-center gap-[12px]">
              <input className="w-[408px] h-[48px] pl-[24px] rounded-[48px] border border-solid border-[#4a4a4a]" type="text" placeholder="Enter e-mail address" />

              <div className="w-[48px] h-[48px] rounded-full send-button flex items-center justify-center">Send</div>
            </div>
          </div>
        </div>

        {/* 第三部分 */}
        <div className="footer-final">
          <div className="footer-left">
            <div className="footer-box">
              <div className="footer-box-title">Product</div>
              <div className="footer-box-item">Features</div>
              <div className="footer-box-item">Pricing</div>
              <div className="footer-box-item">FAQ</div>
              <div className="footer-box-item">User Guide</div>
            </div>

            <div className="footer-box">
              <div className="footer-box-title">Company</div>
              <div className="footer-box-item">About Us</div>
              <div className="footer-box-item">Careers</div>
            </div>

            <div className="footer-box">
              <div className="footer-box-title">Contact</div>
              <div className="footer-box-item">veve.official@outlook.com</div>
            </div>
          </div>

          <div className="footer-right"> 
            <div className="footer-box">
              <div className="footer-box-title">Social Media</div>
              <div className="footer-box-item">Instagram</div>
              <div className="footer-box-item">YouTube</div>
              <div className="footer-box-item">LinkedIn</div>
              <div className="footer-box-item">TikTok</div>
            </div>
          </div>

        </div>
      </div>
      {/* 第四部分 */}
      <div className="h-px bg-[#333333] w-full mt-[66px]"></div>
      <div className="mt-[16px] text-[14px] text-[#999999] leading-[14px]">© 2025. SeeMe. All Rights Reserved.</div>
    </div>
  )
}