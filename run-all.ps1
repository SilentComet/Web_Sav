# Start Backend
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "apps\backend" -WindowStyle Minimized

# Start Hosting Dashboard
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "apps\hosting-dashboard" -WindowStyle Minimized

# Start Business Portal
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "apps\business-portal" -WindowStyle Minimized

Write-Host "All services started in background windows."
Write-Host "Backend: http://localhost:3001"
Write-Host "Hosting Dashboard: http://localhost:5173"
Write-Host "Business Portal: http://localhost:3000"
