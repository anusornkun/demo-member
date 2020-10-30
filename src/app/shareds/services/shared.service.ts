import { Injectable } from "@angular/core";
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable()
export class SharedService {

  // ตำแหน่งของสมาชิก
  positionItems: any[] = [
    'Frontend Davaloper',
    'Backend Developer',
    'Full Stack'
  ];

  //แปลงไฟล์รูปภาพ เป็น base64
  onConvertImage(input: HTMLInputElement) {
    return new Promise((resolve, rejects) => {
      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const imageSize = 300;
      //หากไม่มีการอัพโหลดภาพ หรือ เลือกภาพ
      if (input.files.length == 0)
        return resolve(null);
      //ตรวจสอบชนิดของไฟล์ที่อัพโหลดเข้ามา
      if (imageTypes.indexOf(input.files[0].type) < 0) {
        return rejects({ Message: 'กรุณาเลือกรูปภาพเท่านั้น' });
      }
      //ตรวจสอบขนาดของรูปภาพ
      if (input.files[0].size / 1024 > imageSize)
        return rejects({ Message: `กรุณาอัพโหลดรูปภาพไม่เกิน ${imageSize} KB` });

      const reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      //คืนค่า image Base64
      reader.addEventListener('load', () => resolve(reader.result));
    });
  }

}
