!include LogicLib.nsh

; Начало скрипта установки

; Заголовок установщика
Name "Installer CutOpt"
OutFile "CutOptInstaller.exe"
RequestExecutionLevel user

; Задание директорий установки
InstallDir "$PROGRAMFILES\CuttingApp"

; Стандартные страницы, присутствующие в любом установщике, типа "Выберите каталог для установки" и т.д.

Page directory
Page instfiles

; Установка Electron JS
Section "Electron JS" SecElectron
  SetOutPath $INSTDIR
  File /r "dist\CutOpt-win32-x64\"
SectionEnd

; Установка Python приложения
;Section "Python App" SecPython
 ; SetOutPath $INSTDIR
  ;File /r "dist\CutOpt-win32-x64\resources\app\public\python\"
;SectionEnd

; Завершение установки
Section "Complete" SecComplete
; Дополнительные действия после установки
SectionEnd

; Конец скрипта установки