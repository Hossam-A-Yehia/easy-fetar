import type { StaticImageData } from "next/image";

import abanob from "@/assets/employees/abanoube.jpg";
import ahmedAlaa from "@/assets/employees/ahmed-alaa.jpg";
import ahmedAli from "@/assets/employees/Ahmed ali.jpg";
import ahmedQutb from "@/assets/employees/Ahmed-Kotb.jpg";
import ahmedEid from "@/assets/employees/Ahmed_eid.jpg";
import ayaMohamed from "@/assets/employees/Aya_mohamed.jpg";
import mohamedKhrashi from "@/assets/employees/Mohame-kharashy.jpg";
import mohamedAllam from "@/assets/employees/mohamed_allam.jpg";
import saeedEldieb from "@/assets/employees/Said_eldeeb.jpg";
import youssefAgag from "@/assets/employees/Youssef-Aggag.jpg";
import hossamYehia from "@/assets/employees/Hossam_Yehia.jpeg";
import MahmoudOmar from "@/assets/employees/Mahmoud_amr.jpg";


/** صور الموظفين؛ من غير ملف نترك المنظر الافتراضي (الأحرف الأولى) */
export const EMPLOYEE_IMAGE_BY_SLUG: Partial<
  Record<string, StaticImageData>
> = {
  abanob,
  "ahmed-alaa": ahmedAlaa,
  "ahmed-ali": ahmedAli,
  "ahmed-qutb": ahmedQutb,
  "ahmed-eid": ahmedEid,
  "aya-mohamed": ayaMohamed,
  "mohamed-khrashi": mohamedKhrashi,
  "mohamed-allam": mohamedAllam,
  "saeed-eldieb": saeedEldieb,
  "youssef-agag": youssefAgag,
  "hossam-yahya": hossamYehia,
  "mahmoud-omar": MahmoudOmar,
};

export function getEmployeePhoto(
  slug: string,
): StaticImageData | undefined {
  return EMPLOYEE_IMAGE_BY_SLUG[slug];
}
