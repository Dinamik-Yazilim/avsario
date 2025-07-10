"use client"
// React kütüphanesini ve gerekli hook'ları import ediyoruz.
import React, { useState, useRef } from 'react';

// Görev nesnesi için TypeScript arayüzü tanımlıyoruz.
// 'children' özelliği recursive olarak kendini tanımlar.
interface Task {
  id: string;
  content: string;
  completed: boolean;
  children: Task[];
}

// Bu, uygulamanın ana bileşenidir.
// Basitlik adına, tüm proje ve görev yönetimini tek bir bileşende birleştiriyoruz.
// Gerçek bir Next.js uygulamasında bu, 'pages/projects/[id].tsx' gibi bir sayfada veya
// 'components/TaskBoard.tsx' gibi bir bileşende yer alacaktır.
function App() {
  // Görevlerin durumunu tutan state. Görevler hiyerarşik bir yapıya sahiptir.
  // TypeScript ile `Task[]` tipini belirtiyoruz.
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', content: 'İlk göreviniz burada!', completed: false, children: [] },
    { id: 'task-2', content: 'Bu görevi sürükleyip bırakabilirsiniz.', completed: false, children: [
      { id: 'task-2-1', content: 'Alt Görev Örneği 1', completed: false, children: [] },
      { id: 'task-2-2', content: 'Alt Görev Örneği 2', completed: false, children: [] }
    ]},
    { id: 'task-3', content: 'Başka bir ana görev.', completed: false, children: [] }
  ]);
  // Yeni görev eklemek için kullanılan input alanının içeriğini tutar.
  const [newTaskContent, setNewTaskContent] = useState<string>('');
  // Sürüklenen öğenin kimliğini geçici olarak saklamak için kullanılır.
  // `string | null` tipinde bir değer tutacağını belirtiyoruz.
  const dragItem = useRef<string | null>(null);

  /**
   * Belirtilen kimliğe sahip görevi ve onun ebeveynini (varsa) bulur.
   * Bu fonksiyon, sürükle-bırak işlemleri sırasında görevlerin konumunu belirlemek için kullanılır.
   * @param {Task[]} tasksArray - Aranacak görev dizisi.
   * @param {string} taskId - Aranacak görevin kimliği.
   * @param {Task | null} parent - Mevcut ebeveyn görev.
   * @returns {{task: Task, parent: Task | null, index: number} | null} - Görev, ebeveyn ve dizin bilgisi veya null.
   */
  const findTaskAndParent = (tasksArray: Task[], taskId: string, parent: Task | null = null): { task: Task; parent: Task | null; index: number } | null => {
    for (let i = 0; i < tasksArray.length; i++) {
      const task = tasksArray[i];
      if (task.id === taskId) {
        return { task, parent, index: i };
      }
      if (task.children && task.children.length > 0) {
        const foundInChild = findTaskAndParent(task.children, taskId, task);
        if (foundInChild) return foundInChild;
      }
    }
    return null;
  };

  /**
   * Bir görevin, başka bir görevin alt görevi (torunu vb.) olup olmadığını kontrol eder.
   * Sonsuz döngüleri ve hatalı sürüklemeleri önlemek için kullanılır.
   * @param {Task} ancestor - Olası üst görev.
   * @param {string} childId - Kontrol edilecek alt görevin kimliği.
   * @returns {boolean} - Alt görevse true, değilse false.
   */
  const isDescendant = (ancestor: Task, childId: string): boolean => {
    if (!ancestor.children || ancestor.children.length === 0) return false;
    for (const child of ancestor.children) {
      if (child.id === childId) return true;
      if (isDescendant(child, childId)) return true;
    }
    return false;
  };

  /**
   * Yeni bir görev ekler.
   * @remarks Gerçek uygulamada bu işlem backend'e bir RESTful çağrı ile gönderilir ve WebSocket üzerinden güncellenir.
   */
  const handleAddTask = (): void => {
    if (newTaskContent.trim() === '') return;
    const newId = `task-${Date.now()}`; // Benzersiz bir kimlik oluştur
    setTasks((prevTasks: Task[]) => [
      ...prevTasks,
      { id: newId, content: newTaskContent, completed: false, children: [] }
    ]);
    setNewTaskContent('');
    // TODO: Bu görev backend'e kaydedilmeli (örn: POST /api/projects/:id/tasks)
    // ve WebSocket üzerinden diğer kullanıcılara broadcast edilmelidir.
  };

  /**
   * Belirtilen kimliğe sahip görevi siler. Alt görevleri de silinir.
   * @remarks Gerçek uygulamada bu işlem backend'e bir RESTful çağrı ile gönderilir ve WebSocket üzerinden güncellenir.
   * @param {string} taskIdToDelete - Silinecek görevin kimliği.
   */
  const handleDeleteTask = (taskIdToDelete: string): void => {
    const removeTaskRecursive = (tasksArray: Task[]): Task[] => {
      return tasksArray.filter((task: Task) => {
        if (task.id === taskIdToDelete) {
          return false; // Bu görevi kaldır
        }
        if (task.children) {
          // Alt görevlerini recursive olarak kontrol et
          task.children = removeTaskRecursive(task.children);
        }
        return true; // Diğer görevleri tut
      });
    };
    setTasks(removeTaskRecursive(tasks));
    // TODO: Bu görev backend'den silinmeli (örn: DELETE /api/projects/:id/tasks/:taskId)
    // ve WebSocket üzerinden diğer kullanıcılara broadcast edilmelidir.
  };

  /**
   * Bir görevin tamamlanma durumunu değiştirir.
   * @remarks Gerçek uygulamada bu işlem backend'e bir RESTful çağrı ile gönderilir ve WebSocket üzerinden güncellenir.
   * @param {string} taskId - Tamamlanma durumu değiştirilecek görevin kimliği.
   */
  const handleToggleComplete = (taskId: string): void => {
    const toggleRecursive = (tasksArray: Task[]): Task[] => {
      return tasksArray.map((task: Task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        if (task.children) {
          return { ...task, children: toggleRecursive(task.children) };
        }
        return task;
      });
    };
    setTasks(toggleRecursive(tasks));
    // TODO: Bu görevin tamamlanma durumu backend'de güncellenmeli (örn: PUT /api/projects/:id/tasks/:taskId)
    // ve WebSocket üzerinden diğer kullanıcılara broadcast edilmelidir.
  };

  /**
   * Sürükleme işlemi başladığında çağrılır.
   * Sürüklenen öğenin kimliğini saklar.
   * @param {React.DragEvent<HTMLLIElement>} e - Sürükleme olayı.
   * @param {string} taskId - Sürüklenen görevin kimliği.
   */
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, taskId: string): void => {
    dragItem.current = taskId;
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Bir öğe üzerine sürüklenirken çağrılır.
   * Bırakma işlemini mümkün kılmak için varsayılan davranışı engeller.
   * @param {React.DragEvent<HTMLLIElement>} e - Sürükleme olayı.
   */
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Bir öğe bırakıldığında çağrılır.
   * Görev listesini sürükle-bırak mantığına göre günceller (yeniden sıralama veya iç içe yerleştirme).
   * @remarks Gerçek uygulamada bu işlem backend'e bir RESTful çağrı ile gönderilir ve WebSocket üzerinden güncellenir.
   * @param {React.DragEvent<HTMLLIElement>} e - Bırakma olayı.
   * @param {string} targetTaskId - Bırakma hedefi olan görevin kimliği.
   */
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetTaskId: string): void => {
    e.preventDefault();

    const draggedId = dragItem.current;
    // Eğer sürüklenen öğe yoksa veya kendi üzerine bırakılıyorsa işlem yapma.
    if (!draggedId || draggedId === targetTaskId) {
      dragItem.current = null;
      return;
    }

    // Görev listesinin derin bir kopyasını oluşturarak doğrudan state mutasyonunu önle.
    const newTasks: Task[] = JSON.parse(JSON.stringify(tasks));

    // Sürüklenen ve hedef görevlerin bilgilerini (kendisi, ebeveyni, dizini) bul.
    const draggedInfo = findTaskAndParent(newTasks, draggedId);
    const targetInfo = findTaskAndParent(newTasks, targetTaskId);

    // Eğer bilgi bulunamazsa hata durumunu işle.
    if (!draggedInfo || !targetInfo) {
      dragItem.current = null;
      return;
    }

    // Bir görevi kendi içine veya kendi alt görevlerinden birine sürüklemeyi engelle.
    if (draggedInfo.task.id === targetInfo.task.id || isDescendant(draggedInfo.task, targetInfo.task.id)) {
      console.warn("Hata: Bir görev kendi içine veya alt görevlerinden birine sürüklenemez.");
      dragItem.current = null;
      return;
    }

    // Sürüklenen görevi orijinal konumundan kaldır.
    let draggedTask: Task | null = null;
    if (draggedInfo.parent) {
      // Eğer ebeveyni varsa, ebeveyninin çocuk dizisinden kaldır.
      draggedTask = draggedInfo.parent.children.splice(draggedInfo.index, 1)[0];
    } else {
      // Yoksa, ana görevler dizisinden kaldır.
      draggedTask = newTasks.splice(draggedInfo.index, 1)[0];
    }

    if (!draggedTask) { // Bu durum normalde oluşmamalı ama TypeScript için kontrol ekleyelim
        dragItem.current = null;
        return;
    }

    // Bırakma konumunu belirle: Hedef öğenin neresine bırakıldığı (üst, alt, orta).
    const dropPosition = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const itemHeight = e.currentTarget.offsetHeight;

    // Bırakma işlemi:
    if (dropPosition > itemHeight * 0.75) { // Alt çeyreğe bırakma: Hedefin altına yerleştir.
      if (targetInfo.parent) {
        targetInfo.parent.children.splice(targetInfo.index + 1, 0, draggedTask);
      } else {
        newTasks.splice(targetInfo.index + 1, 0, draggedTask);
      }
    } else if (dropPosition < itemHeight * 0.25) { // Üst çeyreğe bırakma: Hedefin üstüne yerleştir.
        if (targetInfo.parent) {
            targetInfo.parent.children.splice(targetInfo.index, 0, draggedTask);
        } else {
            newTasks.splice(targetInfo.index, 0, draggedTask);
        }
    } else { // Orta alana bırakma: Hedefin alt görevi yap.
        targetInfo.task.children = targetInfo.task.children || []; // Alt görev dizisi yoksa oluştur.
        targetInfo.task.children.push(draggedTask); // draggedTask'ı targetInfo.task'ın alt görevi yap.
    }

    // Güncellenmiş görev listesini state'e ayarla.
    setTasks(newTasks);
    // Sürükleme işlemini sıfırla.
    dragItem.current = null;
    // TODO: Görev sıralaması ve/veya ebeveyn ilişkisi backend'de güncellenmeli.
    // Bu, WebSocket üzerinden diğer kullanıcılara broadcast edilmelidir.
    // Örn: Bir WebSocket mesajı ile 'task:reorder' veya 'task:nest' olayları gönderilebilir.
  };

  /**
   * Görevleri recursive olarak (iç içe) render eden yardımcı fonksiyon.
   * Tailwind CSS sınıfları ile görünüm ayarlanır.
   * @param {Task[]} tasksToRender - Render edilecek görev dizisi.
   * @param {number} level - İç içe geçme seviyesi (girinti için).
   * @returns {JSX.Element} - Görevlerin JSX listesi.
   */
  const renderTasks = (tasksToRender: Task[], level: number = 0): JSX.Element => {
    return (
      <ul className={`space-y-1 ${level > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}`}>
        {tasksToRender.map((task: Task) => (
          <li
            key={task.id}
            draggable // Bu öğenin sürüklenebilir olduğunu belirtir.
            onDragStart={(e: React.DragEvent<HTMLLIElement>) => handleDragStart(e, task.id)} // Sürükleme başladığında kimliği kaydet.
            onDragOver={handleDragOver} // Üzerine sürüklenirken varsayılan davranışı engelle.
            onDrop={(e: React.DragEvent<HTMLLIElement>) => handleDrop(e, task.id)} // Bırakma işlemi gerçekleştiğinde çağır.
            className={`relative flex flex-col items-center bg-white p-2 rounded-lg shadow-sm border ${task.completed ? 'border-green-400' : 'border-gray-200'} group`}
          >
            {/* Görev tamamlama checkbox'ı */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
            />
            {/* Görev içeriği */}
            <span className={`flex-1 text-gray-800 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.content}
            </span>
            {/* Görev silme butonu */}
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Görevi Sil"
            >
              {/* Silme ikonu (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Eğer alt görevleri varsa, onları da recursive olarak render et */}
            {task.children && task.children.length > 0 && renderTasks(task.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    // Ana kapsayıcı div, Tailwind CSS ile responsive ve estetik bir görünüm sağlar.
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-inter">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Proje Görevleri Yönetimi
        </h1>

        {/* Yeni Görev Ekleme Bölümü */}
        <div className="flex mb-8 space-x-4">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskContent(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddTask(); }} // Enter tuşu ile görev ekleme
            placeholder="Yeni görev ekleyin..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200"
          >
            Görev Ekle
          </button>
        </div>

        {/* Görev Listesi Bölümü */}
        {tasks.length === 0 ? (
          // Görev yoksa bilgilendirme mesajı
          <p className="text-center text-gray-500 italic mt-10">
            Henüz görev yok. Yeni bir görev ekleyerek başlayın!
          </p>
        ) : (
          // Görevler varsa, renderTasks fonksiyonu ile listele
          <div>
            {renderTasks(tasks)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
