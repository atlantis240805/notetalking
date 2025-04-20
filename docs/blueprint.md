# **App Name**: NoteNest

## Core Features:

- Create Note: Create a new note with a unique ID, creation timestamp, and update timestamp.
- Read Note: Display a list of note titles and detailed content of selected note.
- Update Note: Modify the content of an existing note, updating the updated_at timestamp.
- Delete Note: Remove a note from the data store.
- Search, Filter, and Sort: Filter notes based on keywords found in their content, and sort notes by creation or update time.

## Style Guidelines:

- Primary color: Light gray (#F0F0F0) for the main background.
- Secondary color: White (#FFFFFF) for panels and note backgrounds.
- Accent: Teal (#008080) for buttons and interactive elements.
- Clean and simple sans-serif fonts for readability.
- Use minimalist icons for actions like Add, Edit, Delete, and Search.
- Split layout with a Listbox on the left for note titles and a Text widget on the right for content.

## Original User Request:
Bạn là một Senior Python developer kiêm UI/UX designer.  
Tôi muốn xây dựng một **ứng dụng ghi chú** đơn giản, với các yêu cầu sau:

1. **Lưu trữ mã nguồn**  
   - Sử dụng **Git + GitHub**, theo chiến lược nhánh: `main`, `develop`, `feature/<tên_feature>`.  
   - Có file `.gitignore`, `README.md` mô tả dự án và cách chạy.

2. **Chức năng CRUD ghi chú**  
   - **Create**: thêm mới ghi chú, tự động gán `id`, lưu `created_at` và `updated_at`.  
   - **Read**: hiển thị danh sách ghi chú và xem nội dung chi tiết.  
   - **Update**: sửa nội dung ghi chú, cập nhật `updated_at`.  
   - **Delete**: xóa ghi chú.

3. **Tìm kiếm, lọc, sắp xếp**  
   - Tìm theo từ khóa trong `content`.  
   - Lọc hoặc sắp xếp theo `created_at`/`updated_at`.

4. **Lưu trữ dữ liệu**  
   - File `data.json` có cấu trúc:
     ```json
     {
       "notes": [
         { "id": 1, "content": "...", "created_at": "...", "updated_at": "..." }
       ]
     }
     ```
   - Viết các hàm `load_data()`, `save_data()`, `add_note()`, `update_note()`, `delete_note()`, `find_notes()` trong `json_handler.py`.

5. **Giao diện GUI**  
   - Dùng **tkinter** để tạo cửa sổ chính, bao gồm:  
     - **Listbox** hiển thị tiêu đề các ghi chú.  
     - **Text widget** soạn/sửa nội dung.  
     - Các **Button**: Thêm, Sửa, Xóa, Tìm kiếm, Làm mới.

6. **Phong cách code**  
   - Tuân theo PEP8, đặt tên biến rõ ràng, commit message định dạng: `<type>(<scope>): <mô tả>`.

Khi hoàn thành, hãy trả về cho tôi:

- **File `json_handler.py`** với đầy đủ hàm đọc/ghi JSON.  
- **File `main.py`** khởi tạo GUI và kết nối tới các hàm JSON.  
- **README.md** mô tả cách cài đặt và chạy.  
- **.gitignore** phù hợp.

Cảm ơn!
  