# IF3260 - Grafika Komputer - Tugas Besar 3
## Important Disclaimer
*Kind of not recommended* untuk mengikuti repository ini untuk mengerjakan tugas besar. Secara personal, hasil pengerjaan tugas besar ini dirasa sangat tidak satifying. Spesifikasi tidak tersampai, kualitas bare minimum. Salah satu mata kuliah favorit dan ditunggu-tunggu, tetapi hasil pengerjaan tugas besar yang tidak memenuhi spesifikasi dan salah satu yang paling jelek dari semua hasil pekerjaan selama di-IF. Maaf grafkom, i have failed you :(

Anyway, sebagian besar kode masih sama dari tugas besar 2. Untuk mapping sendiri, hanya texture dan environment mapping yang diimplementasikan (more disclaimer:  kedua mapping ini pun diimplementasikan dengan hasil yang kurang bagus). Untuk displacement, secara intentional melakukan *cheating*, yang sebenarnya hanya random noises dilabeli "displacement" direpository ini. Articulated model merupakan buatan sendiri sehingga mungkin terkesan random dan tidak jelas. 


## Tips
- Untuk yang masih memiliki tenaga (konteks: semester 6 IF) dan ingin mengerjakan tugas besar ini dengan baik, gunakan fitur search pada GitLab IF untuk mencari contoh lain articulated model
![gambar](https://user-images.githubusercontent.com/30568743/226350131-b06edfdf-aa08-498e-8d07-b10437c02cc0.png)
- Penting : Meskipun isi dalam matriks (elemen-elemen matriks) penting, dalam pengerjaan tugas ini <ins>**pandang matriks sebagai suatu objek utuh**</ins> (dalam fancy words: satu *Linear Map*). 
- Satu objek utuh dalam artian, Matriks tidak dipandang dari isinya, tetapi *efek* transformasinya. Semisal ada matriks translasi `M_translate` *mentranslasikan objek ke depan*, invers dari matriks tersebut berarti matriks `inv_mat(M_translate)` yang *mentranslasi objek ke belakang*. Sama juga untuk rotasi 30 derajat clockwise, invers adalah 30 derajat counterclockwise. Ya, elemen-elemen matriks penting untuk mengkalkulasikan elemen dari invers, tetapi dalam graphic programming lebih berguna mengabstraksikan isi elemen tersebut kecuali dalam fungsi `inv_mat` dan fungsi-fungsi yang berhubungan langsung dengan elemen
- Masih berkaitan dengan matriks, perkalian matriks bisa dianggap komposisi dari fungsi translasi, rotasi, dan lain-lain (komposisi fungsi juga tidak komutatif). Dan fungsi-fungsi ini sendiri bisa dipandang sebagai melakukan translasi, rotasi, scaling, step-by-step. Contoh, ingin scaling origin 2x lipat `mat_sc2`, menggeser objek ke depan `mat_trans_front`, merotasikan 30 CCW dengan titik origin `mat_rot30`. Dalam kalkulasi memang dapat dilakukan `mat_res = mat_rot30 * mat_trans_front * mat_sc2` dan untuk setiap titik `transformed_point = mat_res * point`, tetapi dalam imajinasi dapat dipikirkan melakukan scaling 2x titik dengan origin -> menggeser titik ke depan -> merotasikan 30 derajat CCW.
- Meskipun tips matriks diatas berlaku juga pada tugas besar ke 2 (`world_matrix` dan `camera_matrix`, kenapa `camera_matrix` dikali invers translasi? pikirkan dari lokasi kamera yang statis dan matriks sebagai objek transformasi), pada tugas besar ini yang membutuhkan banyak transformasi pada child relatif dengan parent akan *quickly out of hand* jika memikirkan elemen dari matriks.
- Child akan menggunakan parent sebagai kerangka acuan. Jika parent terletak pada `(1, 3, 5)` pada titik itu dari pandangan child adalah `(0, 0, 0)`
- Cek website https://webglfundamentals.org/ untuk detail dan penjelasan beberapa konsep articulated model, texture, environment, dan displacement mapping


## Anggota Kelompok

Nama                   | NIM
----                   | ---
Wilson Tandya          | 13519209
Tanur Rizaldi Rahardjo | 13519214
