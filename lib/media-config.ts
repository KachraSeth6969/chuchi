// Media URL configuration for clean Cloudinary migration
// Images and videos only - music stays in /public/music/

interface MediaUrls {
  [key: string]: string;
}

// Start with your first batch of migrated files
export const MEDIA_URLS: MediaUrls = {
  // ✅ MIGRATED - Batch 1 (Test files)
  '/images/1.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759115352/1_j73kam.jpg',
  '/images/2.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759115471/2_vhqivv.jpg',
  '/images/3.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759115490/3_vfcapo.jpg',
  // ✅ MIGRATED - Batch 2 (Gallery images)
  '/images/20231209_134646.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116860/20231209_134646_b6m1i9.jpg',
  '/images/IMG-20240223-WA0036.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116912/IMG-20240223-WA0036_h9jb3u.jpg',
  '/images/IMG_2916.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116935/IMG_2916_fywxbq.jpg',
  '/images/IMG_3185.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116957/IMG_3185_mppfja.jpg',
  '/images/IMG_3243.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116978/IMG_3243_ebiiqj.jpg',
  '/images/IMG_3669.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759116992/IMG_3669_sgkflm.jpg',
  '/images/IMG_3984.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117022/IMG_3984_ctban7.jpg',
  '/images/IMG_5717.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117042/IMG_5717_endxow.jpg',
  '/images/IMG_5761.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117058/IMG_5761_djrxkq.jpg',
  '/images/IMG_6124.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117073/IMG_6124_hsp0mq.jpg',
  '/images/IMG_6160.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117092/IMG_6160_s9ztvr.jpg',
  '/images/IMG_6220.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117120/IMG_6220_xlisco.jpg',
  '/images/IMG_6279.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117135/IMG_6279_y2h8av.jpg',
  // '/images/76.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117172/76_iojogs.jpg', // Removed duplicate key
  '/images/23.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117194/23_w0dj6j.jpg',
  '/images/916.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117222/916_xkzo47.jpg',
  '/images/915.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117239/915_oy4dc5.jpg',
  '/images/914.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117259/914_p4fwcf.jpg',
  '/images/913.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117277/913_dj29xi.jpg',
  '/images/912.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117298/912_jitmws.jpg',
  '/images/911.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759117315/911_rh2sna.jpg',

   '/images/11.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122647/11_yjyexv.jpg',
   '/images/12.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122673/12_v6wbxz.jpg',
   '/images/13.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122695/13_eyc8sv.jpg',
   '/images/14.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122725/14_ysxjtq.jpg',
   '/images/15.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122762/15_kbnjaq.jpg',
   '/videos/16.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759122846/16_xwfdhi.mp4',
   
    '/images/21.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123683/21_ikhs0p.jpg',
    '/images/22.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123671/22_ng9cs1.jpg',
    // '/images/23.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759122647/11_yjyexv.jpg', // Removed duplicate key
    '/images/24.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123679/24_gshdgi.jpg',
    '/images/25.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123688/25_s7ktzl.jpg",
    '/images/26.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123668/26_c6cvfo.jpg",
    
    '/images/31.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123911/31_vpoasc.jpg",
    '/images/32.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123912/32_gjevll.jpg",
    '/images/33.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123912/33_ks7w35.jpg",
    '/images/34.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123911/34_if0f4e.jpg",
    '/images/35.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123910/35_bvp4yj.jpg",
    '/images/36.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759123910/36_yywcv4.jpg",

    '/videos/39.mp4': "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759125480/39_oezm4f.mp4",
    '/videos/37.mp4': "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759125463/37_uzbx9y.mp4",
    '/videos/38.mp4': "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759125463/38_ssxwqn.mp4",


        '/videos/41.mp4': "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759126242/41_cdjttg.mp4",
    '/videos/43.mp4': "https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759126247/43_ibhcek.mp4",
    '/images/42.jpg': "https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759126348/42_vntwun.jpg",

    // ✅ MIGRATED - Batch 4 (Adde pe proposal trip)
    '/videos/519.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759137145/519_aua5qs.mp4',
    '/images/516.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137202/516_rdcez6.jpg',
    '/images/51.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137263/51_kjfivp.jpg',
    '/images/52.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137260/52_fhxmc6.jpg',
    '/images/53.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137257/53_tx7yrp.jpg',
    '/images/54.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137266/54_nkilzp.jpg',
    '/images/55.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137264/55_uz9whf.jpg',
    '/images/56.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137262/56_g402oa.jpg',
    '/images/57.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137261/57_cm9qqe.jpg',
    '/images/58.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137263/58_rhu3ls.jpg',
    '/images/59.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137271/59_jr2csq.jpg',
    '/images/510.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137690/510_kyh7cj.jpg',
    '/images/511.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137691/511_efcemh.jpg',
    '/images/512.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137690/512_jwwou9.jpg',
    '/images/514.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137691/514_rfdxoe.jpg',
    '/images/515.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759137692/515_rrnlbk.jpg',
    
    // ✅ MIGRATED - Batch 8 (10 days trip)
    '/videos/81.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759141551/81_b2s4p0.mp4',
    '/images/82.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141784/82_b6evut.jpg',
    '/images/83.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141785/83_kcggly.jpg',
    '/images/84.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141769/84_brjuko.jpg',
    '/images/818.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142533/818_tztdwo.jpg',
    '/images/85.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141773/85_udwzts.jpg',
    '/images/86.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141785/86_gstbgc.jpg',
    '/images/87.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141793/87_j07zuu.jpg',
    '/images/88.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141778/88_wiwiwr.jpg',
    '/images/89.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759141777/89_wcn8g4.jpg',
    '/images/811.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142539/811_omhpem.jpg',
    '/images/812.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142547/812_xknv1v.jpg',
    '/images/813.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142551/813_av9s2d.jpg',
    '/images/814.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142553/814_g22goa.jpg',
    '/images/815.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142535/815_d4juo5.jpg',
    '/images/816.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142535/816_wjfwvh.jpg',
    '/images/817.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142541/817_csobkg.jpg',
    '/images/819.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142534/819_yytsjd.jpg',
    '/images/820.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142544/820_uxwnso.jpg',
    '/images/821.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142554/821_aw7bmo.jpg',
    '/images/822.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759142534/822_f39mv9.jpg',
    
    // ✅ MIGRATED - Batch 9 (First bike trip)
    '/images/924.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150325/924_s8qm9n.jpg',
    '/images/925.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150325/925_enriax.jpg',
    '/images/926.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150324/926_jo4u2v.jpg',
    '/images/927.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150315/927_wp8nsv.jpg',
    '/images/928.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150316/928_kl4qvv.jpg',
    '/images/929.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150316/929_l0aqbh.jpg',
    '/images/930.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150318/930_oveh4e.jpg',
    '/images/931.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150315/931_ujebb0.jpg',
    '/images/932.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150315/932_kitwdw.jpg',
    '/images/933.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150319/933_c9dpbq.jpg',
    '/images/934.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150319/934_zmutcn.jpg',
    '/images/935.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150332/935_ithwqy.jpg',
    '/images/936.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150326/936_gxbo9y.jpg',
    '/images/937.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150331/937_zstffg.jpg',
    '/images/938.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150319/938_brjkvk.jpg',
    '/images/939.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759150329/939_iit1xk.jpg',
    '/videos/921.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759150592/921_yl66oe.mp4',
    
    // ✅ MIGRATED - Batch 10 (Random Shite videos)
    '/videos/626.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759150792/626_nsrnwc.mp4',
    '/videos/627.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759150802/627_ykxaeo.mp4',
    '/videos/61.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759150930/61_tig3ri.mp4',
    '/videos/71.mp4': 'https://res.cloudinary.com/dm1qjbqpx/video/upload/v1759151067/71_jcdjon.mp4',
    
    // ✅ MIGRATED - Batch 11 (Random Shite images - FINAL BATCH!)
    '/images/62.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151160/62_itghfl.jpg',
    '/images/63.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151155/63_ani2xb.jpg',
    '/images/64.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151164/64_ugzmao.jpg',
    '/images/65.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151157/65_fdamgs.jpg',
    '/images/66.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151151/66_ktlhiz.jpg',
    '/images/67.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151149/67_nep6cr.jpg',
    '/images/68.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151164/68_sxqsyp.jpg',
    '/images/69.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151148/69_dl55xp.jpg',
    '/images/610.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151303/610_kbngvq.jpg',
    '/images/611.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151317/611_leiojq.jpg',
    '/images/612.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151300/612_qrvapm.jpg',
    '/images/613.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151282/613_kxiinv.jpg',
    '/images/614.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151314/614_kimvye.jpg',
    '/images/615.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151282/615_gm2vq4.jpg',
    '/images/616.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151312/616_wugm6k.jpg',
    '/images/617.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151299/617_zuazzo.jpg',
    '/images/618.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151324/618_bu5qlw.jpg',
    '/images/619.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151314/619_xszbpl.jpg',
    '/images/620.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151320/620_kzhrhg.jpg',
    '/images/621.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151280/621_toplpu.jpg',
    '/images/622.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151374/622_w8apxu.jpg',
    '/images/623.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151331/623_izwb39.jpg',
    '/images/624.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151331/624_mrjvuh.jpg',
    '/images/625.JPG': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151281/625_nhetrt.jpg',
    '/images/72.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151546/72_kwcgnm.jpg',
    '/images/73.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151539/73_b46wlp.jpg',
    '/images/74.jpeg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151546/74_cbu076.jpg',
    '/images/75.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151529/75_mezoxp.jpg',
    '/images/76.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151533/76_sf7ait.jpg',
    '/images/77.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151537/77_mvsdtl.jpg',
    '/images/78.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151535/78_xvuh2k.jpg',
    '/images/79.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151530/79_uwayo6.jpg',
    '/images/710.jpg': 'https://res.cloudinary.com/dm1qjbqpx/image/upload/v1759151514/710_cdvppq.jpg',
    
  // 🎉 MIGRATION COMPLETE! All media files now optimized with Cloudinary CDN!



    



    
  // TODO: Add more files as you upload them
  // Note: Music files will continue to use /public/music/ paths
};

// Helper function to get media URL
export const getMediaUrl = (originalPath: string): string => {
  // Music files always stay local - no migration needed
  if (originalPath.startsWith('/music/')) {
    return originalPath;
  }
  
  // Check if we have a Cloudinary URL for images/videos
  const cloudinaryUrl = MEDIA_URLS[originalPath];
  
  if (cloudinaryUrl) {
    return cloudinaryUrl;
  }
  
  // Fallback to original path (during migration)
  return originalPath;
};

// Utility to check if file is migrated
export const isFileMigrated = (originalPath: string): boolean => {
  return Boolean(MEDIA_URLS[originalPath]);
};

// Get migration progress
export const getMigrationProgress = (): { migrated: number; total: number; percentage: number } => {
  const migratedFiles = Object.keys(MEDIA_URLS).length;
  
  // Only counting images + videos (music stays local)
  // ~100 images + ~12 videos = ~112 files to migrate
  const totalFiles = 112; // Images and videos only
  
  return {
    migrated: migratedFiles,
    total: totalFiles,
    percentage: Math.round((migratedFiles / totalFiles) * 100)
  };
};

// Generate video poster URL from Cloudinary video
export const getVideoPoster = (videoUrl: string): string => {
  // For Cloudinary videos: transform to get first frame as image
  if (videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
    // Insert poster transformation: so_0,f_jpg gets first frame as JPEG
    return videoUrl.replace('/video/upload/', '/video/upload/so_0,f_jpg/');
  }
  
  // For local videos: return empty string (browser will show blank)
  return '';
};