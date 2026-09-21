import React, { useState } from 'react';
import {
  FolderGit2,
  Smartphone,
  FileCode2,
  Sparkles,
  Check,
  Copy,
  Download,
  Palette,
  Shield,
  Layers,
  Code2
} from 'lucide-react';

export const AndroidCodeSection: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'Color' | 'Type' | 'Theme' | 'CustomerScreen' | 'AdminTasksScreen'>('Color');
  const [copied, setCopied] = useState(false);

  const kotlinFiles = {
    Color: `// package com.aman.app.ui.theme
package com.aman.app.ui.theme

import androidx.compose.ui.graphics.Color

// ============================================================================
// AMAN | أمان — Official Brand Identity Color Palette (Jetpack Compose)
// Directly matched from official visual identity specifications
// ============================================================================

val AmanPrimary = Color(0xFF087F6E)        // Deep Rich Emerald (RGB 8 127 110)
val AmanSecondary = Color(0xFF19899A)      // Vibrant Cyan-Teal (RGB 25 154 154)
val AmanAccent = Color(0xFF6EE7B7)         // Fresh Mint (RGB 110 231 183)
val AmanLight = Color(0xFFE9F8F5)          // Light Mint Tint (RGB 233 248 245)
val AmanBackground = Color(0xFFF7FAF9)     // Soft Calm Background (RGB 247 250 249)
val AmanSurface = Color(0xFFFFFFFF)        // Pure White Surface (RGB 255 255 255)
val AmanTextPrimary = Color(0xFF183B2D)    // Dark Forest Green (RGB 24 59 45)
val AmanTextSecondary = Color(0xFF6E7A77)  // Refined Muted Gray (RGB 110 122 119)
val AmanBorder = Color(0xFFDCE9E6)         // Crisp Border (RGB 220 233 230)

// Urgency & Status Badges
val StatusActiveBg = Color(0xFFE9F8F5)
val StatusActiveText = Color(0xFF087F6E)
val StatusReviewBg = Color(0xFFFEF3C7)
val StatusReviewText = Color(0xFFD97706)
val StatusRejectedBg = Color(0xFFFEE2E2)
val StatusRejectedText = Color(0xFFDC2626)
val UrgencyOverdueBg = Color(0xFFFEE2E2)
val UrgencyOverdueText = Color(0xFFB91C1C)
val UrgencyDueBg = Color(0xFFFEF3C7)
val UrgencyDueText = Color(0xFFB45309)
val UrgencyDueSoonBg = Color(0xFFEFF6FF)
val UrgencyDueSoonText = Color(0xFF1D4ED8)
`,
    Type: `// package com.aman.app.ui.theme
package com.aman.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.aman.app.R

// ============================================================================
// AMAN | أمان — Typography Specification (Cairo for Arabic, Inter for English)
// ============================================================================

val CairoFontFamily = FontFamily(
    Font(R.font.cairo_regular, FontWeight.Normal),
    Font(R.font.cairo_medium, FontWeight.Medium),
    Font(R.font.cairo_semibold, FontWeight.SemiBold),
    Font(R.font.cairo_bold, FontWeight.Bold)
)

val AmanTypography = Typography(
    // H1: 32/40 Bold
    headlineLarge = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp,
        color = AmanTextPrimary
    ),
    // H2: 24/32 Semibold
    headlineMedium = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
        color = AmanTextPrimary
    ),
    // H3: 20/28 Medium
    titleLarge = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 20.sp,
        lineHeight = 28.sp,
        color = AmanTextPrimary
    ),
    // Body: 16/24 Regular
    bodyLarge = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = AmanTextPrimary
    ),
    // Caption: 14/20 Regular
    bodyMedium = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = AmanTextSecondary
    ),
    // Button: 16/24 Semibold
    labelLarge = TextStyle(
        fontFamily = CairoFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 24.sp
    )
)
`,
    Theme: `// package com.aman.app.ui.theme
package com.aman.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val AmanLightColorScheme = lightColorScheme(
    primary = AmanPrimary,
    onPrimary = AmanSurface,
    primaryContainer = AmanLight,
    onPrimaryContainer = AmanPrimary,
    secondary = AmanSecondary,
    onSecondary = AmanSurface,
    background = AmanBackground,
    onBackground = AmanTextPrimary,
    surface = AmanSurface,
    onSurface = AmanTextPrimary,
    outline = AmanBorder
)

@Composable
fun AmanTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = AmanLightColorScheme,
        typography = AmanTypography,
        content = content
    )
}
`,
    CustomerScreen: `// package com.aman.app.ui.customer
package com.aman.app.ui.customer

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aman.app.ui.theme.*

@Composable
fun CustomerHomeScreen(
    customerName: String = "أحمد محمد",
    protectedNumber: String = "+967 77 123 4567",
    remainingDays: Int = 111,
    onAddNewNumberClick: () -> Unit
) {
    Scaffold(
        containerColor = AmanBackground,
        bottomBar = { CustomerBottomNavigation() }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header: Greeting + Notification Bell
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(AmanLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("أم", color = AmanPrimary, style = MaterialTheme.typography.titleMedium)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("مرحباً، $customerName", style = MaterialTheme.typography.titleMedium)
                        Text("حماية أرقامك أولويتنا", color = AmanPrimary, fontSize = 12.sp)
                    }
                }
                IconButton(
                    onClick = { /* Open Notifications */ },
                    modifier = Modifier.background(AmanSurface, RoundedCornerShape(12.dp))
                ) {
                    Icon(Icons.Default.Notifications, contentDescription = "الإشعارات", tint = AmanTextPrimary)
                }
            }

            // Primary Highlight Card (Emerald Gradient)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(AmanPrimary, AmanSecondary)
                        )
                    )
                    .padding(20.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("رقم محمي ومضمون", color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp)
                        Surface(
                            shape = CircleShape,
                            color = Color.White.copy(alpha = 0.2f)
                        ) {
                            Text(
                                "مفعل ✓",
                                color = Color.White,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Text(
                        protectedNumber,
                        color = Color.White,
                        fontSize = 24.sp,
                        style = MaterialTheme.typography.headlineMedium
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.2f))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("باقة الحماية السنوية", color = Color.White.copy(alpha = 0.85f), fontSize = 12.sp)
                        Text("متبقي $remainingDays يوم", color = AmanAccent, fontSize = 13.sp)
                    }
                }
            }

            // Action Button: Add Number
            Button(
                onClick = onAddNewNumberClick,
                colors = ButtonDefaults.buttonColors(containerColor = AmanPrimary),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("إضافة رقم جديد لحمايته", style = MaterialTheme.typography.labelLarge)
            }
        }
    }
}

@Composable
fun CustomerBottomNavigation() {
    NavigationBar(containerColor = AmanSurface) {
        NavigationBarItem(
            selected = true,
            onClick = {},
            icon = { Icon(Icons.Default.Shield, contentDescription = null) },
            label = { Text("الرئيسية") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmanPrimary,
                selectedTextColor = AmanPrimary,
                indicatorColor = AmanLight
            )
        )
    }
}
`,
    AdminTasksScreen: `// package com.aman.app.ui.admin
package com.aman.app.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aman.app.ui.theme.*

data class TelecomPaymentTask(
    val id: String,
    val phoneNumber: String,
    val providerName: String,
    val customerName: String,
    val amountYER: Int,
    val urgency: String // OVERDUE, DUE, DUE_SOON, UPCOMING
)

@Composable
fun AdminTasksScreen(
    tasks: List<TelecomPaymentTask>,
    onCompleteTask: (String) -> Unit
) {
    Scaffold(containerColor = AmanBackground) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                "المهام التشغيلية لسداد الاتصالات",
                style = MaterialTheme.typography.headlineMedium
            )
            Text(
                "يجب سداد مبالغ التجديد لدى الشركات لتفادي سحب أرقام العملاء",
                style = MaterialTheme.typography.bodyMedium
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(tasks) { task ->
                    TaskCard(task = task, onComplete = { onCompleteTask(task.id) })
                }
            }
        }
    }
}

@Composable
fun TaskCard(task: TelecomPaymentTask, onComplete: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = AmanSurface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(task.phoneNumber, style = MaterialTheme.typography.titleLarge)
                UrgencyBadge(urgency = task.urgency)
            }
            Text("العميل: \${task.customerName} • \${task.providerName}", color = AmanTextSecondary, fontSize = 13.sp)
            Text("المبلغ المطلوب سداده: \${task.amountYER} YER", color = AmanPrimary, fontSize = 14.sp)
            Button(
                onClick = onComplete,
                colors = ButtonDefaults.buttonColors(containerColor = AmanPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("إكمال وسداد الاتصالات")
            }
        }
    }
}

@Composable
fun UrgencyBadge(urgency: String) {
    val (bgColor, textColor) = when (urgency) {
        "OVERDUE" -> UrgencyOverdueBg to UrgencyOverdueText
        "DUE" -> UrgencyDueBg to UrgencyDueText
        else -> UrgencyDueSoonBg to UrgencyDueSoonText
    }
    Surface(
        color = bgColor,
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = urgency,
            color = textColor,
            fontSize = 11.sp,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(kotlinFiles[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#087F6E] to-[#19899A] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            <span>Kotlin & Jetpack Compose</span>
            <span>•</span>
            <span>Production Source Code</span>
          </div>
          <h2 className="text-2xl font-bold">أكواد تطبيق الأندرويد الرسمية (Android Native Code)</h2>
          <p className="text-xs text-emerald-100 max-w-xl">
            كافة ملفات التصميم وثيم الألوان والخطوط والشاشات متوافقة 100% مع الهوية البصرية الرسمية، وجاهزة للنسخ أو الاستخدام المباشر في مشروع Android Studio.
          </p>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-white rounded-2xl border border-[#DCE9E6] shadow-xs overflow-hidden">
        {/* File Tabs Header */}
        <div className="bg-[#F7FAF9] border-b border-[#DCE9E6] p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'Color', name: 'Color.kt', label: 'باليتة الألوان' },
              { id: 'Type', name: 'Type.kt', label: 'خط Cairo والطباعة' },
              { id: 'Theme', name: 'Theme.kt', label: 'ثيم أمان الموحد' },
              { id: 'CustomerScreen', name: 'CustomerHomeScreen.kt', label: 'شاشة العميل' },
              { id: 'AdminTasksScreen', name: 'AdminTasksScreen.kt', label: 'شاشة مهام الإدارة' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFile(tab.id as any)}
                className={`py-2 px-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  activeFile === tab.id
                    ? 'bg-[#087F6E] text-white shadow-xs'
                    : 'text-[#183B2D] hover:bg-[#E9F8F5]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="py-2 px-3.5 bg-white border border-[#DCE9E6] hover:border-[#087F6E] text-[#087F6E] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الكود البرمجي</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed">
          <pre>{kotlinFiles[activeFile]}</pre>
        </div>
      </div>
    </div>
  );
};
